import React from 'react';
import { PartografEntryData } from '@/types/partograf';

interface PartografChartSheetProps {
    entries: PartografEntryData[];
    onSelectEntry?: (entry: PartografEntryData) => void;
}

export const PartografChartSheet: React.FC<PartografChartSheetProps> = ({ entries, onSelectEntry }) => {
    // 32 Kolom (16 Jam, tiap jam = 2 kolom @30 menit)
    const TOTAL_COLUMNS = 32;
    const LABEL_W = 140;
    const CELL_W = 28;
    const TOTAL_W = LABEL_W + TOTAL_COLUMNS * CELL_W;

    // Helper untuk mapping kolom index (0 - 31) ke koordinat X tengah kolom
    const getX = (colIdx: number) => LABEL_W + colIdx * CELL_W + CELL_W / 2;

    // Map entri berdasarkan kolom_idx untuk akses cepat
    const entryMap = new Map<number, PartografEntryData>();
    entries.forEach((e) => entryMap.set(e.kolom_idx, e));

    // 1. Koordinat DJJ (80 - 200) -> Height 130px (Y: 10 s/d 140)
    const DJJ_TOP = 15;
    const DJJ_HEIGHT = 130;
    const getDjjY = (djj: number) => DJJ_TOP + ((200 - djj) / (200 - 80)) * DJJ_HEIGHT;

    // 2. Baris Ketuban & Penyusupan
    const KETUBAN_Y = 160;
    const PENYUSUPAN_Y = 184;

    // 3. Pembukaan Serviks (0 - 10) & Turun Kepala -> Height 140px (Y: 215 s/d 355)
    const SERV_TOP = 215;
    const SERV_HEIGHT = 140;
    const getServiksY = (cm: number) => SERV_TOP + ((10 - cm) / 10) * SERV_HEIGHT;

    // 4. Waktu Jam
    const TIME_Y = 370;

    // 5. Kontraksi (1 - 5) -> Height 70px (Y: 410 s/d 480)
    const KONTRAKSI_TOP = 410;
    const KONTRAKSI_HEIGHT = 70;

    // 6. Oksitosin & Obat
    const OKSI_Y = 495;
    const TETES_Y = 515;
    const OBAT_Y = 535;

    // 7. Nadi & TD (60 - 180) -> Height 130px (Y: 575 s/d 705)
    const TD_TOP = 575;
    const TD_HEIGHT = 130;
    const getTdY = (val: number) => TD_TOP + ((180 - val) / (180 - 60)) * TD_HEIGHT;

    // 8. Suhu & Urin
    const SUHU_Y = 720;
    const URIN_PROT_Y = 742;
    const URIN_ASE_Y = 762;
    const URIN_VOL_Y = 782;
    const TOTAL_H = 810;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-4">
            <div className="overflow-x-auto">
                <svg
                    viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
                    className="w-full min-w-[960px] text-slate-800 select-none font-sans"
                    style={{ maxHeight: '1050px' }}
                >
                    {/* SVG Pattern untuk Arsiran Kontraksi */}
                    <defs>
                        {/* 20-40 detik: Garis-garis diagonal */}
                        <pattern id="diagonal-stripe" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="6" stroke="#0f172a" strokeWidth="2" />
                        </pattern>
                        {/* < 20 detik: Titik-titik dots */}
                        <pattern id="dot-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
                            <circle cx="3" cy="3" r="1.2" fill="#0f172a" />
                        </pattern>
                    </defs>

                    {/* Background Sheet */}
                    <rect x="0" y="0" width={TOTAL_W} height={TOTAL_H} fill="#ffffff" />

                    {/* ═══════════ SECTION 1: DENYUT JANTUNG JANIN (80 - 200) ═══════════ */}
                    <g className="section-djj">
                        {/* Label Sumbu Kiri */}
                        <text x="10" y={DJJ_TOP + 40} className="text-[11px] font-bold fill-slate-700">Denyut</text>
                        <text x="10" y={DJJ_TOP + 55} className="text-[11px] font-bold fill-slate-700">Jantung</text>
                        <text x="10" y={DJJ_TOP + 70} className="text-[11px] font-bold fill-slate-700">Janin</text>
                        <text x="10" y={DJJ_TOP + 85} className="text-[10px] fill-slate-500">(/menit)</text>

                        {/* Grid Horizontal & Nilai Skala (80 - 200, step 10) */}
                        {Array.from({ length: 13 }).map((_, i) => {
                            const val = 200 - i * 10;
                            const y = DJJ_TOP + (i / 12) * DJJ_HEIGHT;
                            const isBold = val === 120 || val === 160;
                            return (
                                <g key={`djj-grid-${val}`}>
                                    <text x={LABEL_W - 8} y={y + 3.5} textAnchor="end" className={`text-[10px] ${isBold ? 'font-bold fill-emerald-800' : 'fill-slate-500'}`}>
                                        {val}
                                    </text>
                                    <line x1={LABEL_W} y1={y} x2={TOTAL_W} y2={y} stroke={isBold ? '#059669' : '#e2e8f0'} strokeWidth={isBold ? '1.5' : '0.75'} strokeDasharray={isBold ? '4,2' : undefined} />
                                </g>
                            );
                        })}

                        {/* Grid Vertikal Waktu */}
                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            const isHour = col % 2 === 0;
                            return <line key={`djj-col-${col}`} x1={x} y1={DJJ_TOP} x2={x} y2={DJJ_TOP + DJJ_HEIGHT} stroke={isHour ? '#cbd5e1' : '#f1f5f9'} strokeWidth={isHour ? '1' : '0.5'} />;
                        })}

                        {/* Plot Titik & Garis DJJ */}
                        {entries.length > 1 && (
                            <polyline
                                fill="none"
                                stroke="#0284c7"
                                strokeWidth="2"
                                points={entries.filter((e) => e.djj !== null && e.djj !== undefined).map((e) => `${getX(e.kolom_idx)},${getDjjY(e.djj!)}`).join(' ')}
                            />
                        )}
                        {entries.map((e) => e.djj && (
                            <circle key={`djj-dot-${e.id}`} cx={getX(e.kolom_idx)} cy={getDjjY(e.djj)} r="4" fill="#0284c7" className="hover:scale-125 cursor-pointer transition-transform" onClick={() => onSelectEntry?.(e)} />
                        ))}
                    </g>

                    {/* ═══════════ SECTION 2: AIR KETUBAN & PENYUSUPAN ═══════════ */}
                    <g className="section-liquor">
                        {/* Garis Pembatas Horizontal */}
                        <line x1="0" y1={KETUBAN_Y - 8} x2={TOTAL_W} y2={KETUBAN_Y - 8} stroke="#0f172a" strokeWidth="1.5" />
                        <text x="10" y={KETUBAN_Y + 7} className="text-[10px] font-bold fill-slate-700">Air ketuban</text>
                        <text x="10" y={PENYUSUPAN_Y + 7} className="text-[10px] font-bold fill-slate-700">Penyusupan</text>

                        {/* Grid Kotak */}
                        <line x1={LABEL_W} y1={KETUBAN_Y + 12} x2={TOTAL_W} y2={KETUBAN_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={LABEL_W} y1={PENYUSUPAN_Y + 12} x2={TOTAL_W} y2={PENYUSUPAN_Y + 12} stroke="#0f172a" strokeWidth="1.5" />

                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            return <line key={`liq-col-${col}`} x1={x} y1={KETUBAN_Y - 8} x2={x} y2={PENYUSUPAN_Y + 12} stroke="#cbd5e1" strokeWidth="1" />;
                        })}

                        {/* Nilai Simbol */}
                        {entries.map((e) => (
                            <g key={`liq-val-${e.id}`}>
                                {e.air_ketuban && (
                                    <text x={getX(e.kolom_idx)} y={KETUBAN_Y + 5} textAnchor="middle" className="text-[11px] font-bold fill-blue-700">
                                        {e.air_ketuban}
                                    </text>
                                )}
                                {e.penyusupan && (
                                    <text x={getX(e.kolom_idx)} y={PENYUSUPAN_Y + 5} textAnchor="middle" className="text-[11px] font-bold fill-purple-700">
                                        {e.penyusupan}
                                    </text>
                                )}
                            </g>
                        ))}
                    </g>

                    {/* ═══════════ SECTION 3: PEMBUKAAN SERVIKS & TURUN KEPALA ═══════════ */}
                    <g className="section-cervix">
                        <text x="10" y={SERV_TOP + 40} className="text-[10px] font-bold fill-slate-800">Pembukaan (cm) ✕</text>
                        <text x="10" y={SERV_TOP + 58} className="text-[10px] font-bold fill-slate-700">Turun kepala ○</text>

                        {/* Skala Y (0 - 10) */}
                        {Array.from({ length: 11 }).map((_, i) => {
                            const cm = 10 - i;
                            const y = SERV_TOP + (i / 10) * SERV_HEIGHT;
                            return (
                                <g key={`cerv-grid-${cm}`}>
                                    <text x={LABEL_W - 8} y={y + 3.5} textAnchor="end" className="text-[10px] font-bold fill-slate-600">
                                        {cm}
                                    </text>
                                    <line x1={LABEL_W} y1={y} x2={TOTAL_W} y2={y} stroke="#e2e8f0" strokeWidth="0.75" />
                                </g>
                            );
                        })}

                        {/* Grid Vertikal */}
                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            const isHour = col % 2 === 0;
                            return <line key={`cerv-col-${col}`} x1={x} y1={SERV_TOP} x2={x} y2={SERV_TOP + SERV_HEIGHT} stroke={isHour ? '#cbd5e1' : '#f1f5f9'} strokeWidth={isHour ? '1' : '0.5'} />;
                        })}

                        {/* GARIS WASPADA (ALERT LINE: Dari (0, 4cm) ke (6 jam / 12 col, 10cm)) */}
                        <line
                            x1={LABEL_W}
                            y1={getServiksY(4)}
                            x2={LABEL_W + 12 * CELL_W}
                            y2={getServiksY(10)}
                            stroke="#ea580c"
                            strokeWidth="2.5"
                        />
                        {/* Label WASPADA pada garis */}
                        {['W', 'A', 'S', 'P', 'A', 'D', 'A'].map((char, idx) => (
                            <text key={`waspada-${idx}`} x={LABEL_W + (idx * 2 + 0.6) * CELL_W} y={getServiksY(4 + idx) - 6} className="text-[10px] font-bold fill-orange-700">
                                {char}
                            </text>
                        ))}

                        {/* GARIS BERTINDAK (ACTION LINE: Selisih 4 Jam / 8 col di sebelah kanan) */}
                        <line
                            x1={LABEL_W + 8 * CELL_W}
                            y1={getServiksY(4)}
                            x2={LABEL_W + 20 * CELL_W}
                            y2={getServiksY(10)}
                            stroke="#dc2626"
                            strokeWidth="2.5"
                        />
                        {['B', 'E', 'R', 'T', 'I', 'N', 'D', 'A', 'K'].map((char, idx) => (
                            <text key={`bertindak-${idx}`} x={LABEL_W + ((idx + 4) * 1.5 + 2.5) * CELL_W} y={getServiksY(4 + idx * 0.75) - 6} className="text-[10px] font-bold fill-red-700">
                                {char}
                            </text>
                        ))}

                        {/* Garis & Tanda Pembukaan Serviks (X) */}
                        {entries.length > 1 && (
                            <polyline
                                fill="none"
                                stroke="#0f172a"
                                strokeWidth="2"
                                points={entries.filter((e) => e.pembukaan_serviks !== null && e.pembukaan_serviks !== undefined).map((e) => `${getX(e.kolom_idx)},${getServiksY(e.pembukaan_serviks!)}`).join(' ')}
                            />
                        )}
                        {entries.map((e) => e.pembukaan_serviks !== null && e.pembukaan_serviks !== undefined && (
                            <g key={`cerv-x-${e.id}`} className="cursor-pointer" onClick={() => onSelectEntry?.(e)}>
                                <line x1={getX(e.kolom_idx) - 5} y1={getServiksY(e.pembukaan_serviks!) - 5} x2={getX(e.kolom_idx) + 5} y2={getServiksY(e.pembukaan_serviks!) + 5} stroke="#0f172a" strokeWidth="2.5" />
                                <line x1={getX(e.kolom_idx) + 5} y1={getServiksY(e.pembukaan_serviks!) - 5} x2={getX(e.kolom_idx) - 5} y2={getServiksY(e.pembukaan_serviks!) + 5} stroke="#0f172a" strokeWidth="2.5" />
                            </g>
                        ))}

                        {/* Garis & Tanda Penurunan Kepala (O) */}
                        {entries.length > 1 && (
                            <polyline
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                                points={entries.filter((e) => e.penurunan_kepala !== null && e.penurunan_kepala !== undefined).map((e) => `${getX(e.kolom_idx)},${getServiksY(e.penurunan_kepala!)}`).join(' ')}
                            />
                        )}
                        {entries.map((e) => e.penurunan_kepala !== null && e.penurunan_kepala !== undefined && (
                            <circle key={`head-o-${e.id}`} cx={getX(e.kolom_idx)} cy={getServiksY(e.penurunan_kepala!)} r="5" fill="none" stroke="#2563eb" strokeWidth="2" className="cursor-pointer" onClick={() => onSelectEntry?.(e)} />
                        ))}
                    </g>

                    {/* ═══════════ SECTION 4: WAKTU (JAM KE- & WAKTU AKTUAL) ═══════════ */}
                    <g className="section-time">
                        <line x1="0" y1={SERV_TOP + SERV_HEIGHT} x2={TOTAL_W} y2={SERV_TOP + SERV_HEIGHT} stroke="#0f172a" strokeWidth="1.5" />
                        <text x="10" y={TIME_Y + 5} className="text-[10px] font-bold fill-slate-700">Waktu (jam)</text>

                        {/* Angka Jam ke- 1 s/d 16 (per 2 kolom) */}
                        {Array.from({ length: 16 }).map((_, h) => {
                            const colStart = h * 2;
                            const xCenter = LABEL_W + colStart * CELL_W + CELL_W;
                            return (
                                <g key={`hour-num-${h}`}>
                                    <text x={xCenter} y={TIME_Y + 5} textAnchor="middle" className="text-[10px] font-bold fill-slate-800">
                                        {h + 1}
                                    </text>
                                    <line x1={LABEL_W + (h + 1) * 2 * CELL_W} y1={TIME_Y - 15} x2={LABEL_W + (h + 1) * 2 * CELL_W} y2={TIME_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                                </g>
                            );
                        })}
                        <line x1={LABEL_W} y1={TIME_Y + 12} x2={TOTAL_W} y2={TIME_Y + 12} stroke="#0f172a" strokeWidth="1.5" />
                    </g>

                    {/* ═══════════ SECTION 5: KONTRAKSI TIAP 10 MENIT ═══════════ */}
                    <g className="section-contractions">
                        <text x="10" y={KONTRAKSI_TOP + 18} className="text-[10px] font-bold fill-slate-800">Kontraksi</text>
                        <text x="10" y={KONTRAKSI_TOP + 32} className="text-[10px] fill-slate-600">tiap 10 mnt</text>
                        <text x="10" y={KONTRAKSI_TOP + 48} className="text-[9px] fill-slate-500">&lt;20 | 20-40 | &gt;40</text>

                        {/* Grid 5 Baris Kontraksi */}
                        {Array.from({ length: 5 }).map((_, i) => {
                            const count = 5 - i;
                            const y = KONTRAKSI_TOP + (i / 5) * KONTRAKSI_HEIGHT;
                            return (
                                <g key={`kontraksi-row-${count}`}>
                                    <text x={LABEL_W - 8} y={y + 11} textAnchor="end" className="text-[9px] font-medium fill-slate-500">
                                        {count}
                                    </text>
                                    <line x1={LABEL_W} y1={y} x2={TOTAL_W} y2={y} stroke="#cbd5e1" strokeWidth="0.75" />
                                </g>
                            );
                        })}
                        <line x1={LABEL_W} y1={KONTRAKSI_TOP + KONTRAKSI_HEIGHT} x2={TOTAL_W} y2={KONTRAKSI_TOP + KONTRAKSI_HEIGHT} stroke="#0f172a" strokeWidth="1.5" />

                        {/* Grid Vertikal Kontraksi */}
                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            return <line key={`kontr-col-${col}`} x1={x} y1={KONTRAKSI_TOP} x2={x} y2={KONTRAKSI_TOP + KONTRAKSI_HEIGHT} stroke="#cbd5e1" strokeWidth="0.75" />;
                        })}

                        {/* Render Arsiran Kontraksi */}
                        {entries.map((e) => {
                            if (!e.kontraksi_jumlah || e.kontraksi_jumlah <= 0) return null;
                            const numBoxes = Math.min(5, e.kontraksi_jumlah);
                            const fillType = e.kontraksi_durasi === '>40'
                                ? '#0f172a'
                                : e.kontraksi_durasi === '20-40'
                                ? 'url(#diagonal-stripe)'
                                : 'url(#dot-pattern)';

                            const boxH = KONTRAKSI_HEIGHT / 5;
                            const x = LABEL_W + e.kolom_idx * CELL_W;
                            const y = KONTRAKSI_TOP + (5 - numBoxes) * boxH;
                            const h = numBoxes * boxH;

                            return (
                                <rect
                                    key={`kontr-rect-${e.id}`}
                                    x={x + 1}
                                    y={y + 1}
                                    width={CELL_W - 2}
                                    height={h - 2}
                                    fill={fillType}
                                    stroke="#0f172a"
                                    strokeWidth="0.5"
                                    className="cursor-pointer"
                                    onClick={() => onSelectEntry?.(e)}
                                />
                            );
                        })}
                    </g>

                    {/* ═══════════ SECTION 6: OKSITOSIN & OBAT/CAIRAN IV ═══════════ */}
                    <g className="section-medication">
                        <text x="10" y={OKSI_Y + 7} className="text-[10px] font-bold fill-slate-700">Oksitosin U/L</text>
                        <text x="10" y={TETES_Y + 7} className="text-[10px] font-bold fill-slate-700">Tetes/menit</text>
                        <text x="10" y={OBAT_Y + 12} className="text-[10px] font-bold fill-slate-700">Obat &amp; Cairan IV</text>

                        <line x1={LABEL_W} y1={OKSI_Y + 12} x2={TOTAL_W} y2={OKSI_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={LABEL_W} y1={TETES_Y + 12} x2={TOTAL_W} y2={TETES_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={0} y1={OBAT_Y + 22} x2={TOTAL_W} y2={OBAT_Y + 22} stroke="#0f172a" strokeWidth="1.5" />

                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            return <line key={`med-col-${col}`} x1={x} y1={OKSI_Y - 8} x2={x} y2={OBAT_Y + 22} stroke="#cbd5e1" strokeWidth="0.75" />;
                        })}

                        {entries.map((e) => (
                            <g key={`med-val-${e.id}`}>
                                {e.oksitosin_unit && <text x={getX(e.kolom_idx)} y={OKSI_Y + 7} textAnchor="middle" className="text-[9px] fill-slate-800">{e.oksitosin_unit}</text>}
                                {e.oksitosin_tetes && <text x={getX(e.kolom_idx)} y={TETES_Y + 7} textAnchor="middle" className="text-[9px] font-bold fill-slate-800">{e.oksitosin_tetes}</text>}
                                {e.obat_cairan_iv && <text x={getX(e.kolom_idx)} y={OBAT_Y + 12} textAnchor="middle" className="text-[9px] fill-slate-800">{e.obat_cairan_iv}</text>}
                            </g>
                        ))}
                    </g>

                    {/* ═══════════ SECTION 7: NADI & TEKANAN DARAH (60 - 180) ═══════════ */}
                    <g className="section-vitals">
                        <text x="10" y={TD_TOP + 40} className="text-[10px] font-bold fill-slate-800">• Nadi</text>
                        <text x="10" y={TD_TOP + 58} className="text-[10px] font-bold fill-slate-700">↕ Tekanan Darah</text>

                        {/* Grid Skala (60 - 180, step 10) */}
                        {Array.from({ length: 13 }).map((_, i) => {
                            const val = 180 - i * 10;
                            const y = TD_TOP + (i / 12) * TD_HEIGHT;
                            return (
                                <g key={`td-grid-${val}`}>
                                    <text x={LABEL_W - 8} y={y + 3.5} textAnchor="end" className="text-[9px] fill-slate-500">{val}</text>
                                    <line x1={LABEL_W} y1={y} x2={TOTAL_W} y2={y} stroke="#e2e8f0" strokeWidth="0.75" />
                                </g>
                            );
                        })}

                        {/* Grid Vertikal */}
                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            const isHour = col % 2 === 0;
                            return <line key={`td-col-${col}`} x1={x} y1={TD_TOP} x2={x} y2={TD_TOP + TD_HEIGHT} stroke={isHour ? '#cbd5e1' : '#f1f5f9'} strokeWidth={isHour ? '1' : '0.5'} />;
                        })}

                        {/* Plot Tekanan Darah (↕ Panah/I-bar sistol-diastol) */}
                        {entries.map((e) => {
                            if (!e.sistol || !e.diastol) return null;
                            const x = getX(e.kolom_idx);
                            const ySis = getTdY(e.sistol);
                            const yDia = getTdY(e.diastol);
                            return (
                                <g key={`bp-${e.id}`}>
                                    <line x1={x} y1={ySis} x2={x} y2={yDia} stroke="#dc2626" strokeWidth="2.5" />
                                    {/* Cap atas & bawah */}
                                    <line x1={x - 4} y1={ySis} x2={x + 4} y2={ySis} stroke="#dc2626" strokeWidth="2" />
                                    <line x1={x - 4} y1={yDia} x2={x + 4} y2={yDia} stroke="#dc2626" strokeWidth="2" />
                                </g>
                            );
                        })}

                        {/* Plot Nadi (• Titik dihubungkan garis) */}
                        {entries.length > 1 && (
                            <polyline
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth="2"
                                points={entries.filter((e) => e.nadi !== null && e.nadi !== undefined).map((e) => `${getX(e.kolom_idx)},${getTdY(e.nadi!)}`).join(' ')}
                            />
                        )}
                        {entries.map((e) => e.nadi && (
                            <circle key={`nadi-${e.id}`} cx={getX(e.kolom_idx)} cy={getTdY(e.nadi)} r="3.5" fill="#16a34a" className="cursor-pointer" onClick={() => onSelectEntry?.(e)} />
                        ))}
                    </g>

                    {/* ═══════════ SECTION 8: SUHU & URIN ═══════════ */}
                    <g className="section-urine">
                        <line x1="0" y1={TD_TOP + TD_HEIGHT} x2={TOTAL_W} y2={TD_TOP + TD_HEIGHT} stroke="#0f172a" strokeWidth="1.5" />

                        <text x="10" y={SUHU_Y + 6} className="text-[10px] font-bold fill-slate-700">Suhu (°C)</text>
                        <text x="10" y={URIN_PROT_Y + 6} className="text-[10px] font-bold fill-slate-700">Protein Urin</text>
                        <text x="10" y={URIN_ASE_Y + 6} className="text-[10px] font-bold fill-slate-700">Aseton Urin</text>
                        <text x="10" y={URIN_VOL_Y + 6} className="text-[10px] font-bold fill-slate-700">Volume Urin</text>

                        <line x1={LABEL_W} y1={SUHU_Y + 12} x2={TOTAL_W} y2={SUHU_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={LABEL_W} y1={URIN_PROT_Y + 12} x2={TOTAL_W} y2={URIN_PROT_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={LABEL_W} y1={URIN_ASE_Y + 12} x2={TOTAL_W} y2={URIN_ASE_Y + 12} stroke="#cbd5e1" strokeWidth="1" />
                        <line x1={0} y1={URIN_VOL_Y + 14} x2={TOTAL_W} y2={URIN_VOL_Y + 14} stroke="#0f172a" strokeWidth="1.5" />

                        {Array.from({ length: TOTAL_COLUMNS + 1 }).map((_, col) => {
                            const x = LABEL_W + col * CELL_W;
                            return <line key={`urine-col-${col}`} x1={x} y1={SUHU_Y - 8} x2={x} y2={URIN_VOL_Y + 14} stroke="#cbd5e1" strokeWidth="0.75" />;
                        })}

                        {entries.map((e) => (
                            <g key={`urine-val-${e.id}`}>
                                {e.suhu && <text x={getX(e.kolom_idx)} y={SUHU_Y + 6} textAnchor="middle" className="text-[9px] font-bold fill-slate-800">{e.suhu}</text>}
                                {e.urin_protein && <text x={getX(e.kolom_idx)} y={URIN_PROT_Y + 6} textAnchor="middle" className="text-[9px] fill-slate-800">{e.urin_protein}</text>}
                                {e.urin_aseton && <text x={getX(e.kolom_idx)} y={URIN_ASE_Y + 6} textAnchor="middle" className="text-[9px] fill-slate-800">{e.urin_aseton}</text>}
                                {e.urin_volume && <text x={getX(e.kolom_idx)} y={URIN_VOL_Y + 6} textAnchor="middle" className="text-[9px] fill-slate-800">{e.urin_volume}</text>}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};
