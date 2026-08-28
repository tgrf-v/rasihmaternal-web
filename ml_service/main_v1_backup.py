from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import xgboost as xgb
import numpy as np
import json
import os
import math
from typing import Dict, Any, Optional

app = FastAPI(
    title="RASIH Maternal Complications ML Service",
    description="Microservice Machine Learning XGBoost untuk Prediksi Risiko Komplikasi Kehamilan dan Persalinan",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directories and models loading
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "xgboost_final_best.json")
CLASSES_PATH = os.path.join(MODELS_DIR, "classes.json")
FEATURE_NAMES_PATH = os.path.join(MODELS_DIR, "feature_names.json")

# Global variables for loaded model artifacts
booster = None
classes_list = [
    "Hipertensi",
    "Infeksi",
    "Ketuban Pecah Dini",
    "Perdarahan",
    "Persalinan Lama",
    "Preeklamsia"
]
feature_names = []

@app.on_event("startup")
def load_ml_artifacts():
    global booster, classes_list, feature_names
    try:
        if os.path.exists(MODEL_PATH):
            booster = xgb.Booster()
            booster.load_model(MODEL_PATH)
            print(f"[ML Service] Model XGBoost successfully loaded from {MODEL_PATH}")

        if os.path.exists(CLASSES_PATH):
            with open(CLASSES_PATH, "r", encoding="utf-8") as f:
                classes_list = json.load(f)
            print(f"[ML Service] Classes list loaded: {classes_list}")

        if os.path.exists(FEATURE_NAMES_PATH):
            with open(FEATURE_NAMES_PATH, "r", encoding="utf-8") as f:
                feature_names = json.load(f)
            print(f"[ML Service] Feature Names loaded ({len(feature_names)} features)")
    except Exception as e:
        print(f"[ML Service ERROR] Failed to load model artifacts: {e}")

class MaternalScreeningRequest(BaseModel):
    # 15 Parameter Klinis Sesuai Dataset Maternal
    usia: int = Field(..., ge=12, le=60, description="Usia Ibu Hamil (Tahun)")
    pekerjaan: str = Field("Ibu Rumah Tangga", description="Ibu Rumah Tangga / Bekerja (PNS, Swasta, Wiraswasta, Petani, dll)")
    pendidikan: str = Field("SLTA", description="SD, SLTP, SLTA, DIPLOMA, SARJANA, MAGISTER")
    gravida: int = Field(1, ge=1, le=20, description="Jumlah Kehamilan (G)")
    para: int = Field(0, ge=0, le=20, description="Jumlah Persalinan/Kelahiran (P)")
    abortus: int = Field(0, ge=0, le=15, description="Jumlah Keguguran (A)")
    imt: float = Field(22.0, ge=10.0, le=60.0, description="Indeks Massa Tubuh (kg/m2)")
    sistolik: int = Field(120, ge=60, le=260, description="Tekanan Darah Sistol (mmHg)")
    diastolik: int = Field(80, ge=40, le=160, description="Tekanan Darah Diastol (mmHg)")
    letak_janin: str = Field("Memanjang", description="Memanjang, Melintang, Obliq, Gemeli")
    umur_kehamilan: str = Field("Aterm", description="Preterm (<37 mg), Aterm (37-41 mg), Postterm (>=42 mg)")
    jenis_persalinan: str = Field("Persalinan Pervaginam", description="Persalinan Pervaginam, Sectio Sesarea")
    hemoglobin: float = Field(12.0, ge=3.0, le=22.0, description="Kadar Hemoglobin (g/dL)")
    leukosit: int = Field(9000, ge=500, le=75000, description="Jumlah Sel Leukosit (/uL)")
    trombosit: int = Field(250000, ge=10000, le=1000000, description="Jumlah Sel Trombosit (/uL)")

def build_feature_vector(req: MaternalScreeningRequest) -> np.ndarray:
    """Transform 15 clinical parameters into the 40-dimensional feature vector required by XGBoost."""
    # Clinical calculated features
    map_val = (req.sistolik + 2 * req.diastolik) / 3.0
    pulse_pressure = float(req.sistolik - req.diastolik)
    
    tromb_safe = max(req.trombosit, 1)
    leu_trombo_ratio = float(req.leukosit) / float(tromb_safe)
    hb_trombo_ratio = float(req.hemoglobin) / float(tromb_safe)
    
    hb_anemia = 1.0 if req.hemoglobin < 11.0 else 0.0
    leu_flag = 1.0 if req.leukosit > 11000 else 0.0
    trombo_flag = 1.0 if req.trombosit < 150000 else 0.0

    # Ordinal mappings
    uk_lower = req.umur_kehamilan.lower()
    if "preterm" in uk_lower:
        kehamilan_ord = 0.0
    elif "postterm" in uk_lower:
        kehamilan_ord = 2.0
    else:
        kehamilan_ord = 1.0

    pend_upper = req.pendidikan.upper().strip()
    if "SD" in pend_upper:
        pendidikan_lev = 1.0
    elif "SLTP" in pend_upper or "SMP" in pend_upper:
        pendidikan_lev = 2.0
    elif "SLTA" in pend_upper or "SMA" in pend_upper or "SMK" in pend_upper:
        pendidikan_lev = 3.0
    elif "DIPLOMA" in pend_upper or "D3" in pend_upper or "D4" in pend_upper:
        pendidikan_lev = 4.0
    elif "SARJANA" in pend_upper or "S1" in pend_upper:
        pendidikan_lev = 5.0
    elif "MAGISTER" in pend_upper or "S2" in pend_upper or "DOKTOR" in pend_upper or "S3" in pend_upper:
        pendidikan_lev = 6.0
    else:
        pendidikan_lev = 3.0

    # IMT Categories
    imt_underweight = 1.0 if req.imt < 18.5 else 0.0
    imt_normal = 1.0 if (18.5 <= req.imt < 25.0) else 0.0
    imt_overweight = 1.0 if (25.0 <= req.imt < 30.0) else 0.0
    imt_obese = 1.0 if req.imt >= 30.0 else 0.0

    # Pekerjaan One-Hot
    pek_lower = req.pekerjaan.lower()
    is_irt = 1.0 if ("rumah tangga" in pek_lower or "irt" in pek_lower) else 0.0
    is_bekerja = 0.0 if is_irt == 1.0 else 1.0

    # Letak Janin One-Hot
    lj_lower = req.letak_janin.lower()
    lj_memanjang = 1.0 if ("memanjang" in lj_lower or "preskep" in lj_lower or "kepala" in lj_lower) else 0.0
    lj_melintang = 1.0 if ("melintang" in lj_lower or "lintang" in lj_lower) else 0.0
    lj_obliq = 1.0 if ("obliq" in lj_lower or "serong" in lj_lower) else 0.0
    lj_gemeli = 1.0 if ("gemeli" in lj_lower or "kembar" in lj_lower) else 0.0

    # Jenis Persalinan One-Hot
    jp_lower = req.jenis_persalinan.lower()
    jp_sc = 1.0 if ("sectio" in jp_lower or "sesarea" in jp_lower or "sc" in jp_lower) else 0.0
    jp_pervaginam = 1.0 if (jp_sc == 0.0) else 0.0

    features_dict = {
        'GRAVIDA': float(req.gravida),
        'PARA': float(req.para),
        'ABORTUS': float(req.abortus),
        'IMT': float(req.imt),
        'HEMOGLOBIN (g/dL)': float(req.hemoglobin),
        'LEOKOSIT (uL)': float(req.leukosit),
        'TROMBOSIT (uL)': float(req.trombosit),
        'TEKANAN DARAH: Sistol': float(req.sistolik),
        'TEKANAN DARAH: Diastol': float(req.diastolik),
        'KEHAMILAN_ORD': kehamilan_ord,
        'PENDIDIKAN_LEV': pendidikan_lev,
        'MAP': float(map_val),
        'PP': float(pulse_pressure),
        'LEU_TROMBO_RATIO': float(leu_trombo_ratio),
        'HB_TROMBO_RATIO': float(hb_trombo_ratio),
        'HB_ANEMIA': hb_anemia,
        'LEU_FLAG': leu_flag,
        'TROMBO_FLAG': trombo_flag,
        'PEKERJAAN_Bekerja': is_bekerja,
        'PEKERJAAN_Ibu Rumah Tangga': is_irt,
        'PEKERJAAN_MISSING': 0.0,
        'LETAK JANIN_Gemeli': lj_gemeli,
        'LETAK JANIN_MEANJANG': 0.0,
        'LETAK JANIN_MEMAJANG': 0.0,
        'LETAK JANIN_MISSING': 0.0,
        'LETAK JANIN_Melintang': lj_melintang,
        'LETAK JANIN_Memanjang': lj_memanjang,
        'LETAK JANIN_Obliq': lj_obliq,
        'LETAK JANIN_Preterm': 0.0,
        'LETAK JANIN_memanjang': lj_memanjang,
        'LETAK JANIN_preskep': lj_memanjang,
        'JENIS PERSALINAN_MISSING': 0.0,
        'JENIS PERSALINAN_PERSALINAN LAMA': 0.0,
        'JENIS PERSALINAN_Persalinan Pervaginam': jp_pervaginam,
        'JENIS PERSALINAN_Sectio Sesarea': jp_sc,
        'JENIS PERSALINAN_Sectio Sesarea (OP GABUNGAN)': 0.0,
        'IMT_CAT_Normal': imt_normal,
        'IMT_CAT_Obese': imt_obese,
        'IMT_CAT_Overweight': imt_overweight,
        'IMT_CAT_Underweight': imt_underweight,
    }

    SCALER_PATH = os.path.join(MODELS_DIR, "feature_scaler.json")
    scaler_dict = {}
    if os.path.exists(SCALER_PATH):
        try:
            with open(SCALER_PATH, "r") as sf:
                scaler_dict = json.load(sf)
        except Exception:
            scaler_dict = {}

    # Construct the array in the exact order of feature_names and scale numerical features
    row = []
    target_names = feature_names if feature_names and len(feature_names) == 40 else list(features_dict.keys())
    for fn in target_names:
        raw_v = features_dict.get(fn, 0.0)
        if fn in scaler_dict:
            m = scaler_dict[fn].get("mean", 0.0)
            s = scaler_dict[fn].get("std", 1.0)
            scaled_v = (raw_v - m) / s if s > 1e-6 else raw_v
            row.append(scaled_v)
        else:
            row.append(raw_v)

    return np.array([row], dtype=np.float32)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RASIH Maternal FastAPI ML Microservice",
        "model_loaded": booster is not None,
        "classes": classes_list,
        "features_count": len(feature_names) if feature_names else 40,
        "version": "1.0.0"
    }

@app.post("/predict")
def predict_maternal_complication(request: MaternalScreeningRequest):
    global booster, classes_list, feature_names

    if booster is None:
        load_ml_artifacts()
        if booster is None:
            raise HTTPException(status_code=503, detail="Model Machine Learning belum siap / gagal dimuat.")

    try:
        feat_matrix = build_feature_vector(request)
        dmat = xgb.DMatrix(feat_matrix, feature_names=feature_names if feature_names else None)
        raw_preds = booster.predict(dmat)[0]

        # Format probability distribution
        prob_dict: Dict[str, float] = {}
        for idx, cls_name in enumerate(classes_list):
            val = float(raw_preds[idx]) if idx < len(raw_preds) else 0.0
            prob_dict[cls_name] = round(val, 4)

        # Primary predicted diagnosis
        top_idx = int(np.argmax(raw_preds))
        primary_diag = classes_list[top_idx] if top_idx < len(classes_list) else "Hipertensi"
        confidence = float(raw_preds[top_idx])

        # Clinical Indicators Calculation
        map_val = round((request.sistolik + 2 * request.diastolik) / 3.0, 2)
        is_hypertension = request.sistolik >= 140 or request.diastolik >= 90
        is_anemia = request.hemoglobin < 11.0
        is_leukocytosis = request.leukosit > 11000
        is_thrombocytopenia = request.trombosit < 150000

        # Determine Risk Level Category
        if primary_diag in ["Preeklamsia", "Perdarahan"] or map_val >= 105.0 or (request.sistolik >= 160 or request.diastolik >= 110):
            risk_category = "KRST"
            risk_label = "Kehamilan Risiko Sangat Tinggi (KRST)"
            faskes_rujukan = "Rumah Sakit PONEK / Dokter Spesialis Sp.OG"
            rekomendasi = "Segera lakukan rujukan terencana ke Rumah Sakit dengan fasilitas PONEK 24 Jam. Lakukan stabilisasi hemodinamik dan observasi ketat."
        elif primary_diag in ["Hipertensi", "Ketuban Pecah Dini", "Persalinan Lama", "Infeksi"] or map_val >= 90.0 or is_hypertension or is_anemia:
            risk_category = "KRT"
            risk_label = "Kehamilan Risiko Tinggi (KRT)"
            faskes_rujukan = "Puskesmas PONED / Bidan Desa & Dokter"
            rekomendasi = "Pendampingan intensif oleh Bidan Wilayah, kontrol tensi berkala, pemeriksaan lab ulang, dan antisipasi rujukan PONED."
        else:
            risk_category = "KRR"
            risk_label = "Kehamilan Risiko Rendah (KRR)"
            faskes_rujukan = "Praktek Mandiri Bidan (PMB) / Puskesmas"
            rekomendasi = "Kondisi kehamilan stabil dan terpantau baik. Lanjutkan asuhan antenatal rutin (ANC), konsumsi vitamin & Tablet Tambah Darah (TTD), serta senam hamil mandiri."

        return {
            "status": "success",
            "primary_diagnosis": primary_diag,
            "confidence_score": round(confidence, 4),
            "risk_category": risk_category,
            "risk_label": risk_label,
            "probabilities": prob_dict,
            "clinical_indicators": {
                "map": map_val,
                "is_hypertension": is_hypertension,
                "is_anemia": is_anemia,
                "is_leukocytosis": is_leukocytosis,
                "is_thrombocytopenia": is_thrombocytopenia,
            },
            "recommendations": {
                "faskes": faskes_rujukan,
                "tindakan": rekomendasi,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses inferensi model: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
