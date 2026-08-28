from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import xgboost as xgb
import numpy as np
import json
import os
import math
from typing import Dict, Any, Optional, List

app = FastAPI(
    title="RASIH Maternal Complications ML Service",
    description="Microservice Machine Learning XGBoost untuk Prediksi Risiko Komplikasi Kehamilan dan Persalinan (Model v2 - 7 Kelas & Model v1 Legacy)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths for Model v2 (7 Classes, 30 Features -> 42 Transformed)
MODELS_V2_DIR = os.path.join(BASE_DIR, "models_v2")
MODEL_V2_PATH = os.path.join(MODELS_V2_DIR, "xgboost_final_model.json")

# Paths for Model v1 (Legacy 6 Classes, 15 Features -> 40 Transformed)
MODELS_V1_DIR = os.path.join(BASE_DIR, "models")
MODEL_V1_PATH = os.path.join(MODELS_V1_DIR, "xgboost_final_best.json")

# Global model state
booster_v2: Optional[xgb.Booster] = None
booster_v1: Optional[xgb.Booster] = None

CLASSES_V2 = [
    "Hipertensi",
    "Infeksi",
    "Ketuban Pecah Dini",
    "Perdarahan",
    "Persalinan Lama",
    "Preeklamsia",
    "Tanpa Komplikasi"
]

CLASSES_V1 = [
    "Hipertensi",
    "Infeksi",
    "Ketuban Pecah Dini",
    "Perdarahan",
    "Persalinan Lama",
    "Preeklamsia"
]

# Categorical mapping for Model v2 (17 binary features)
CAT_MAP_V2 = {
    'PENDIDIKAN': ['Dasar', 'Menengah', 'Tinggi'],
    'PEKERJAAN': ['Bekerja', 'Ibu Rumah Tangga'],
    'PRESENTASI_JANIN': ['Bokong/Sungsang', 'Kepala', 'Lintang', 'Oblique'],
    'PROTEINURIA': ['1+', '2+', '3+', '4+', 'Negatif', 'Trace'],
    'STATUS_KETUBAN': ['Pecah', 'Utuh']
}

# Numeric default medians for Model v2 (25 numeric features)
NUM_MEDIANS_V2 = {
    'USIA_TAHUN': 30.0,
    'TINGGI_BADAN_CM': 154.0,
    'BB_KG': 65.0,
    'IMT': 27.3,
    'GRAVIDA': 2.0,
    'PARA': 1.0,
    'ABORTUS': 0.0,
    'UK_MINGGU': 37.0,
    'UK_HARI': 4.0,
    'JUMLAH_JANIN': 1.0,
    'EFW_BAYI_GRAM': 2775.0,
    'SBP_MMHG': 120.0,
    'DBP_MMHG': 78.0,
    'NADI_XMENIT': 85.0,
    'SUHU_C': 36.7,
    'HEMOGLOBIN_GDL': 11.5,
    'LAMA_KETUBAN_PECAH_JAM': 0.0,
    'PEMBUKAAN_CM': 5.0,
    'STATION_KEPALA': -1.0,
    'KONTRAKSI_10MENIT': 3.0,
    'DURASI_KONTRAKSI_DETIK': 41.0,
    'DJJ': 141.0,
    'MAP': 92.0,
    'PP': 43.0,
    'HB_ANEMIA': 0.0
}


def load_ml_artifacts_v2():
    global booster_v2
    if os.path.exists(MODEL_V2_PATH):
        try:
            b = xgb.Booster()
            b.load_model(MODEL_V2_PATH)
            booster_v2 = b
            print(f"[RASIH ML] Model v2 loaded successfully ({b.num_features()} features, 7 classes)")
        except Exception as e:
            print(f"[RASIH ML] Error loading Model v2: {e}")
    else:
        print(f"[RASIH ML] Warning: Model v2 not found at {MODEL_V2_PATH}")


def load_ml_artifacts_v1():
    global booster_v1
    if os.path.exists(MODEL_V1_PATH):
        try:
            b = xgb.Booster()
            b.load_model(MODEL_V1_PATH)
            booster_v1 = b
            print("[RASIH ML] Model v1 legacy loaded successfully")
        except Exception as e:
            print(f"[RASIH ML] Error loading Model v1: {e}")


# Load on startup
load_ml_artifacts_v2()


class MaternalScreeningRequestV2(BaseModel):
    # Demografi & Antropometri
    usia_tahun: int = Field(default=28, ge=10, le=60, description="Usia ibu dalam tahun")
    pendidikan: str = Field(default="Menengah", description="Dasar, Menengah, Tinggi")
    pekerjaan: str = Field(default="Ibu Rumah Tangga", description="Bekerja atau Ibu Rumah Tangga")
    tinggi_badan_cm: Optional[float] = Field(default=155.0, ge=100.0, le=250.0)
    bb_kg: Optional[float] = Field(default=60.0, ge=30.0, le=250.0)
    imt: Optional[float] = Field(default=None, ge=10.0, le=65.0)

    # Riwayat Obstetri & Gestasi
    hpht: Optional[str] = Field(default=None, description="Tanggal HPHT format YYYY-MM-DD")
    gravida: Optional[int] = Field(default=1, ge=1, le=20)
    para: Optional[int] = Field(default=0, ge=0, le=20)
    abortus: Optional[int] = Field(default=0, ge=0, le=15)
    uk_minggu: Optional[int] = Field(default=38, ge=0, le=45)
    uk_hari: Optional[int] = Field(default=0, ge=0, le=6)
    jumlah_janin: Optional[int] = Field(default=1, ge=1, le=5)
    presentasi_janin: Optional[str] = Field(default="Kepala", description="Bokong/Sungsang, Kepala, Lintang, Oblique")
    efw_bayi_gram: Optional[float] = Field(default=3000.0, ge=300.0, le=6000.0)

    # Tanda Vital & Laboratorium
    sbp_mmhg: Optional[int] = Field(default=120, ge=50, le=260, description="Tekanan Darah Sistol")
    dbp_mmhg: Optional[int] = Field(default=80, ge=30, le=160, description="Tekanan Darah Diastol")
    nadi_xmenit: Optional[float] = Field(default=82.0, ge=40.0, le=180.0)
    suhu_c: Optional[float] = Field(default=36.7, ge=34.0, le=42.0)
    proteinuria: Optional[str] = Field(default="Negatif", description="1+, 2+, 3+, 4+, Negatif, Trace")
    hemoglobin_gdl: Optional[float] = Field(default=12.0, ge=3.0, le=22.0)

    # Intrapartum / Persalinan (Bidan / Partograf)
    status_ketuban: Optional[str] = Field(default="Utuh", description="Pecah atau Utuh")
    lama_ketuban_pecah_jam: Optional[float] = Field(default=0.0, ge=0.0, le=120.0)
    pembukaan_cm: Optional[float] = Field(default=4.0, ge=0.0, le=10.0)
    station_kepala: Optional[float] = Field(default=-1.0, ge=-5.0, le=5.0)
    kontraksi_10menit: Optional[float] = Field(default=3.0, ge=0.0, le=10.0)
    durasi_kontraksi_detik: Optional[float] = Field(default=35.0, ge=0.0, le=120.0)
    djj: Optional[float] = Field(default=140.0, ge=60.0, le=220.0)

    # Parameter Tambahan (Opsional Override)
    map: Optional[float] = Field(default=None)
    pp: Optional[float] = Field(default=None)
    hb_anemia: Optional[int] = Field(default=None)


def normalize_category(val: Optional[str], default: str, valid_choices: List[str]) -> str:
    if not val:
        return default
    cleaned = str(val).strip()
    # Direct match
    for choice in valid_choices:
        if cleaned.lower() == choice.lower():
            return choice
    # Education mapping
    if "sd" in cleaned.lower() or "sltp" in cleaned.lower() or "smp" in cleaned.lower() or "dasar" in cleaned.lower():
        return "Dasar"
    if "slta" in cleaned.lower() or "sma" in cleaned.lower() or "smk" in cleaned.lower() or "menengah" in cleaned.lower():
        return "Menengah"
    if "diploma" in cleaned.lower() or "sarjana" in cleaned.lower() or "s1" in cleaned.lower() or "s2" in cleaned.lower() or "tinggi" in cleaned.lower():
        return "Tinggi"
    # Job mapping
    if "rumah tangga" in cleaned.lower() or "irt" in cleaned.lower():
        return "Ibu Rumah Tangga"
    if "kerja" in cleaned.lower() or "pns" in cleaned.lower() or "swasta" in cleaned.lower() or "wiraswasta" in cleaned.lower() or "petani" in cleaned.lower() or "buruh" in cleaned.lower():
        return "Bekerja"
    # Presentasi Janin mapping
    if "sungsang" in cleaned.lower() or "bokong" in cleaned.lower():
        return "Bokong/Sungsang"
    if "kepala" in cleaned.lower() or "memanjang" in cleaned.lower() or "vertex" in cleaned.lower():
        return "Kepala"
    if "lintang" in cleaned.lower() or "melintang" in cleaned.lower():
        return "Lintang"
    if "obliq" in cleaned.lower() or "oblique" in cleaned.lower():
        return "Oblique"
    # Proteinuria mapping
    if "+" in cleaned:
        if "4+" in cleaned or "++++" in cleaned:
            return "4+"
        if "3+" in cleaned or "+++" in cleaned:
            return "3+"
        if "2+" in cleaned or "++" in cleaned:
            return "2+"
        if "1+" in cleaned or "+" in cleaned:
            return "1+"
    if "trace" in cleaned.lower() or "samar" in cleaned.lower():
        return "Trace"
    if "negatif" in cleaned.lower() or "0" in cleaned or "tidak" in cleaned.lower():
        return "Negatif"
    # Status Ketuban mapping
    if "pecah" in cleaned.lower() or "kpd" in cleaned.lower():
        return "Pecah"
    if "utuh" in cleaned.lower() or "jernih" in cleaned.lower():
        return "Utuh"

    return default


def preprocess_v2(req: MaternalScreeningRequestV2) -> np.ndarray:
    # 1. Normalize Categories
    pendidikan_clean = normalize_category(req.pendidikan, "Menengah", CAT_MAP_V2['PENDIDIKAN'])
    pekerjaan_clean = normalize_category(req.pekerjaan, "Ibu Rumah Tangga", CAT_MAP_V2['PEKERJAAN'])
    presentasi_clean = normalize_category(req.presentasi_janin, "Kepala", CAT_MAP_V2['PRESENTASI_JANIN'])
    proteinuria_clean = normalize_category(req.proteinuria, "Negatif", CAT_MAP_V2['PROTEINURIA'])
    ketuban_clean = normalize_category(req.status_ketuban, "Utuh", CAT_MAP_V2['STATUS_KETUBAN'])

    # 2. Calculated values
    sistolik = float(req.sbp_mmhg if req.sbp_mmhg is not None else 120.0)
    diastolik = float(req.dbp_mmhg if req.dbp_mmhg is not None else 80.0)
    
    # MAP & Pulse Pressure
    map_val = req.map if req.map is not None else (sistolik + 2.0 * diastolik) / 3.0
    pp_val = req.pp if req.pp is not None else (sistolik - diastolik)

    # IMT Calculation if not provided
    tb = req.tinggi_badan_cm if req.tinggi_badan_cm is not None else 155.0
    bb = req.bb_kg if req.bb_kg is not None else 60.0
    if req.imt is not None:
        imt_val = float(req.imt)
    else:
        tb_meter = tb / 100.0
        imt_val = bb / (tb_meter * tb_meter) if tb_meter > 0 else 24.0

    # Hemoglobin & Anemia flag
    hb = float(req.hemoglobin_gdl if req.hemoglobin_gdl is not None else 12.0)
    hb_anemia = req.hb_anemia if req.hb_anemia is not None else (1.0 if hb < 11.0 else 0.0)

    # 3. Build Categorical Vector (17 features)
    cat_vector = []
    # PENDIDIKAN (3)
    for cat in CAT_MAP_V2['PENDIDIKAN']:
        cat_vector.append(1.0 if pendidikan_clean == cat else 0.0)
    # PEKERJAAN (2)
    for cat in CAT_MAP_V2['PEKERJAAN']:
        cat_vector.append(1.0 if pekerjaan_clean == cat else 0.0)
    # PRESENTASI_JANIN (4)
    for cat in CAT_MAP_V2['PRESENTASI_JANIN']:
        cat_vector.append(1.0 if presentasi_clean == cat else 0.0)
    # PROTEINURIA (6)
    for cat in CAT_MAP_V2['PROTEINURIA']:
        cat_vector.append(1.0 if proteinuria_clean == cat else 0.0)
    # STATUS_KETUBAN (2)
    for cat in CAT_MAP_V2['STATUS_KETUBAN']:
        cat_vector.append(1.0 if ketuban_clean == cat else 0.0)

    # Gestational Age derivation from HPHT if available
    uk_minggu_val = float(req.uk_minggu if req.uk_minggu is not None else 38.0)
    uk_hari_val = float(req.uk_hari if req.uk_hari is not None else 0.0)
    if req.hpht:
        try:
            from datetime import datetime, date
            hpht_clean = str(req.hpht).strip().split("T")[0]
            hpht_d = datetime.strptime(hpht_clean, "%Y-%m-%d").date()
            diff_days = (date.today() - hpht_d).days
            if diff_days >= 0:
                uk_minggu_val = float(diff_days // 7)
                uk_hari_val = float(diff_days % 7)
        except Exception:
            pass

    # 4. Build Numeric Vector (25 features in strict order)
    num_vector = [
        float(req.usia_tahun),
        float(tb),
        float(bb),
        float(imt_val),
        float(req.gravida if req.gravida is not None else 1.0),
        float(req.para if req.para is not None else 0.0),
        float(req.abortus if req.abortus is not None else 0.0),
        uk_minggu_val,
        uk_hari_val,
        float(req.jumlah_janin if req.jumlah_janin is not None else 1.0),
        float(req.efw_bayi_gram if req.efw_bayi_gram is not None else 3000.0),
        sistolik,
        diastolik,
        float(req.nadi_xmenit if req.nadi_xmenit is not None else 82.0),
        float(req.suhu_c if req.suhu_c is not None else 36.7),
        hb,
        float(req.lama_ketuban_pecah_jam if req.lama_ketuban_pecah_jam is not None else 0.0),
        float(req.pembukaan_cm if req.pembukaan_cm is not None else 4.0),
        float(req.station_kepala if req.station_kepala is not None else -1.0),
        float(req.kontraksi_10menit if req.kontraksi_10menit is not None else 3.0),
        float(req.durasi_kontraksi_detik if req.durasi_kontraksi_detik is not None else 35.0),
        float(req.djj if req.djj is not None else 140.0),
        float(map_val),
        float(pp_val),
        float(hb_anemia)
    ]

    full_vector = np.array(cat_vector + num_vector, dtype=np.float32)
    return full_vector.reshape(1, -1)


@app.get("/health")
def health_check():
    global booster_v2, booster_v1
    return {
        "status": "healthy",
        "service": "RASIH Maternal FastAPI ML Microservice",
        "model_loaded_v2": booster_v2 is not None,
        "classes_v2": CLASSES_V2,
        "classes_count_v2": len(CLASSES_V2),
        "features_count_v2": 42,
        "model_loaded_v1": booster_v1 is not None,
        "version": "2.0.0"
    }


@app.post("/predict")
def predict_maternal_complications_v2(request: MaternalScreeningRequestV2):
    global booster_v2

    if booster_v2 is None:
        load_ml_artifacts_v2()
        if booster_v2 is None:
            raise HTTPException(
                status_code=503,
                detail="Model ML v2 belum berhasil dimuat. Pastikan berkas xgboost_final_model.json ada di ml_service/models_v2/"
            )

    try:
        # Preprocess request into (1, 42) matrix
        X_matrix = preprocess_v2(request)
        dmatrix = xgb.DMatrix(X_matrix)

        raw_probs = booster_v2.predict(dmatrix)[0]

        # Map to 7 classes
        probabilities: Dict[str, float] = {}
        for cls_name, prob_val in zip(CLASSES_V2, raw_probs):
            probabilities[cls_name] = round(float(prob_val), 4)

        top_index = int(np.argmax(raw_probs))
        primary_diag = CLASSES_V2[top_index]
        confidence = round(float(raw_probs[top_index]), 4)

        # Calculate clinical indicators
        sistol = request.sbp_mmhg or 120
        diastol = request.dbp_mmhg or 80
        map_val = round((sistol + 2 * diastol) / 3.0, 1)
        hb_val = request.hemoglobin_gdl or 12.0

        # Clinical Risk Level & Recommendation Rules
        if primary_diag == "Tanpa Komplikasi":
            risk_category = "KRR"
            rec_level = "Rendah"
            rec_faskes = "Bidan Praktik Mandiri (BPM) / Poskesdes / Puskesmas"
            rec_intervensi = "Kondisi kehamilan terpantau fisiologis dan sehat. Lanjutkan pemeriksaan antenatal rutin (ANC) teratur, nutrisi seimbang, serta konsumsi tablet tambah darah."
        elif primary_diag in ["Preeklamsia", "Perdarahan"]:
            risk_category = "KRST"
            rec_level = "Sangat Tinggi"
            rec_faskes = "Rumah Sakit PONEK 24 Jam / Dokter Spesialis Obstetri & Ginekologi (SpOG)"
            if primary_diag == "Preeklamsia":
                rec_intervensi = f"Indikasi preeklamsia terdeteksi (MAP {map_val} mmHg). Lakukan pemantauan tensi ketat, tes protein urin serial, tirah baring miring kiri, dan siapkan rujukan emergensi PONEK."
            else:
                rec_intervensi = "Waspadai tanda perdarahan aktif. Lakukan pemeriksaan inspekulo, observasi tanda syok hipovolemik, pasang infus dua jalur, dan rujuk segera ke RS PONEK."
        else:
            risk_category = "KRT"
            rec_level = "Tinggi"
            rec_faskes = "Puskesmas PONED / Rumah Sakit Tipe C"
            if primary_diag == "Hipertensi":
                rec_intervensi = f"Hipertensi gestasional (TD {sistol}/{diastol} mmHg). Konseling diet rendah garam, istirahat cukup, dan pemantauan berkala tanda preeklamsia."
            elif primary_diag == "Ketuban Pecah Dini":
                rec_intervensi = "Ketuban pecah sebelum fase aktif. Hindari periksa dalam berulang, berikan profilaksis antibiotik sesuai advis dokter, dan lakukan observasi DJJ."
            elif primary_diag == "Infeksi":
                rec_intervensi = "Tanda infeksi intrauterin/maternal. Pantau suhu tubuh, hitung leukosit serial, dan konsultasikan pemberian antibiotik adekuat."
            elif primary_diag == "Persalinan Lama":
                rec_intervensi = "Kemungkinan kemajuan persalinan terhambat. Evaluasi kurva Partograf (garis waspada/bertindak), pantau his dan DJJ secara ketat."
            else:
                rec_intervensi = "Konsultasikan hasil skrining dengan dokter spesialis atau bidan koordinator untuk penanganan preventif."

        return {
            "status": "success",
            "version": "2.0.0",
            "primary_diagnosis": primary_diag,
            "risk_category": risk_category,
            "confidence_score": confidence,
            "probabilities": probabilities,
            "clinical_indicators": {
                "map": map_val,
                "pulse_pressure": sistol - diastol,
                "is_hypertension": sistol >= 140 or diastol >= 90,
                "is_anemia": hb_val < 11.0,
                "is_preeclampsia_suspect": primary_diag == "Preeklamsia" or (sistol >= 140 and request.proteinuria not in ["Negatif", "Trace", None])
            },
            "recommendations": {
                "level": rec_level,
                "faskes": rec_faskes,
                "intervensi": rec_intervensi
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan inferensi ML v2: {str(e)}")
