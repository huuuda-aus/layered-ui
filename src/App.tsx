import { useEffect, useRef, useState } from 'react'
import { Layer, LayeredScene } from './LayeredScene'
import { HorizontalStack, type HorizontalStackRef } from './HorizontalStack'
import './LayeredScene.css'
import './App.css'

function App() {
  const transitionMs = 250
  const controlStackRef = useRef<HorizontalStackRef>(null)
  const [controlSlideIndex, setControlSlideIndex] = useState(0)
  const controlSlideCount = 2

  const handleControlPrevSlide = () => controlStackRef.current?.goToPrevSlide()
  const handleControlNextSlide = () => controlStackRef.current?.goToNextSlide()

  useEffect(() => {
    const handleSlideKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (controlSlideIndex > 0) {
          controlStackRef.current?.goToPrevSlide()
        }
      } else if (event.key === 'ArrowRight') {
        if (controlSlideIndex < controlSlideCount - 1) {
          controlStackRef.current?.goToNextSlide()
        }
      }
    }

    window.addEventListener('keydown', handleSlideKey)
    return () => window.removeEventListener('keydown', handleSlideKey)
  }, [controlSlideIndex, controlSlideCount])

  return (
    <LayeredScene transitionMs={transitionMs}>
      <Layer>
        <div className="layerPanel">
          <div className="layerMeta">
            <div>Quantum Diagnostics</div>
            <div>Layer 01 / Active Focus</div>
          </div>
          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Qubit Coherence Dashboard</h2>
              <p className="layerSubtitle">Cryogenic stack · 7Q array · 12.4 mK baseline</p>
            </div>
            <div className="layerBadge">Run 0241-A</div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Qubits Online</div>
              <div className="layerCardValue">7 / 8</div>
              <div className="layerCardHint">Q5 in recalibration</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">T1 / T2 (μs)</div>
              <div className="layerCardValue">92.3 / 78.1</div>
              <div className="layerCardHint">Median across active qubits</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">1Q / 2Q Fidelity</div>
              <div className="layerCardValue">99.93% / 99.12%</div>
              <div className="layerCardHint">RB @ 5k shots</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Thermal Load</div>
              <div className="layerCardValue">18.7 μW</div>
              <div className="layerCardHint">Dilution stage</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Coherence Drift (last 6h)</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="Coherence drift chart">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <path
                  d="M12 88 L52 82 L92 76 L132 64 L172 69 L212 58 L252 62 L292 49 L332 54"
                  className="layerChartLine"
                />
                <g className="layerChartDots">
                  <circle cx="12" cy="88" r="3" />
                  <circle cx="52" cy="82" r="3" />
                  <circle cx="92" cy="76" r="3" />
                  <circle cx="132" cy="64" r="3" />
                  <circle cx="172" cy="69" r="3" />
                  <circle cx="212" cy="58" r="3" />
                  <circle cx="252" cy="62" r="3" />
                  <circle cx="292" cy="49" r="3" />
                  <circle cx="332" cy="54" r="3" />
                </g>
                <g className="layerChartGrid">
                  <line x1="12" y1="30" x2="348" y2="30" />
                  <line x1="12" y1="60" x2="348" y2="60" />
                  <line x1="12" y1="90" x2="348" y2="90" />
                </g>
              </svg>
              <div className="layerTinyNote">Stability index: 0.84 · Variance within tolerance</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">State Snapshot</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Bloch sphere overview">
                <defs>
                  <radialGradient id="sphere" cx="50%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#cfcfcf" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6b7280" stopOpacity="0.15" />
                  </radialGradient>
                </defs>
                <circle cx="80" cy="80" r="60" fill="url(#sphere)" stroke="#9aa1b1" strokeOpacity="0.45" />
                <ellipse cx="80" cy="80" rx="58" ry="20" fill="none" stroke="#9aa1b1" strokeOpacity="0.35" />
                <line x1="80" y1="20" x2="80" y2="140" stroke="#9aa1b1" strokeOpacity="0.4" />
                <line x1="20" y1="80" x2="140" y2="80" stroke="#9aa1b1" strokeOpacity="0.4" />
                <circle cx="110" cy="60" r="4" fill="#cfcfcf" />
                <line x1="80" y1="80" x2="110" y2="60" stroke="#cfcfcf" strokeOpacity="0.7" />
              </svg>
              <ul className="layerList">
                <li>Dominant |ψ⟩ angle: 34.2°</li>
                <li>Phase drift: -0.8° / hr</li>
                <li>Leakage: 0.21%</li>
              </ul>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Recent Pulses</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Pulse</div>
                <div>Target</div>
                <div>μs</div>
                <div>Δf (MHz)</div>
                <div>Result</div>
              </div>
              <div className="layerTableRow">
                <div>CR-129</div>
                <div>Q2 → Q4</div>
                <div>0.64</div>
                <div>-0.42</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>XY-410</div>
                <div>Q6</div>
                <div>0.22</div>
                <div>+0.18</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>ZZ-078</div>
                <div>Q1 ↔ Q3</div>
                <div>0.81</div>
                <div>-0.11</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerFootnote">
            Control loop locked at 4.2 kHz · Crosstalk within 2.1% target band
          </div>
        </div>
      </Layer>
      <Layer>
        <HorizontalStack
          ref={controlStackRef}
          gap={100}
          transitionMs={3000}
          onSlideChange={setControlSlideIndex}
        >
          <article className="layerPanel">
            <div className="layerMeta">
              <div>Quantum Control Plane</div>
              <div>Layer 02 / Secondary Focus</div>
            </div>
            <div className="layerHeader">
              <div>
                <h2 className="layerTitle">Pulse Scheduling + Crosstalk Map</h2>
                <p className="layerSubtitle">Adaptive calibration sweep · 18 min window · 5.2 kHz control loop</p>
              </div>
              <div className="layerBadge">Sweep 18-B</div>
            </div>

            <div className="layerGrid">
              <div className="layerCard">
                <div className="layerCardLabel">Active Channels</div>
                <div className="layerCardValue">22 / 24</div>
                <div className="layerCardHint">Two held for isolation</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Gate Queue</div>
                <div className="layerCardValue">146 ops</div>
                <div className="layerCardHint">Pending @ 1.8 ms</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Drive Drift</div>
                <div className="layerCardValue">-0.13 MHz</div>
                <div className="layerCardHint">Median detune</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Crosstalk</div>
                <div className="layerCardValue">1.9%</div>
                <div className="layerCardHint">Below 2.5% cap</div>
              </div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Crosstalk Matrix (Δ)</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="Crosstalk heatmap">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <g className="layerChartGrid">
                  <line x1="12" y1="24" x2="348" y2="24" />
                  <line x1="12" y1="48" x2="348" y2="48" />
                  <line x1="12" y1="72" x2="348" y2="72" />
                  <line x1="12" y1="96" x2="348" y2="96" />
                </g>
                <g className="layerChartDots">
                  <circle cx="40" cy="30" r="4" />
                  <circle cx="84" cy="54" r="5" />
                  <circle cx="140" cy="42" r="3" />
                  <circle cx="192" cy="70" r="4" />
                  <circle cx="232" cy="34" r="5" />
                  <circle cx="286" cy="82" r="4" />
                  <circle cx="320" cy="60" r="3" />
                </g>
              </svg>
              <div className="layerTinyNote">Hot pairs: Q2↔Q4, Q3↔Q7 · Mitigation staged</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Schedule Preview</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Pulse schedule">
                <rect x="16" y="20" width="128" height="16" rx="6" fill="rgba(200,205,215,0.2)" />
                <rect x="16" y="46" width="86" height="12" rx="6" fill="rgba(200,205,215,0.35)" />
                <rect x="16" y="68" width="112" height="12" rx="6" fill="rgba(200,205,215,0.25)" />
                <rect x="16" y="90" width="74" height="12" rx="6" fill="rgba(200,205,215,0.3)" />
                <rect x="16" y="112" width="96" height="12" rx="6" fill="rgba(200,205,215,0.2)" />
              </svg>
              <ul className="layerList">
                <li>Cycle time: 3.6 μs</li>
                <li>Max overlap: 4 pulses</li>
                <li>Idle padding: 0.18 μs</li>
              </ul>
            </div>
          </article>
          <article className="layerPanel">
            <div className="layerSectionTitle">Calibration + Feedback</div>
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Calibration Notes</div>
              <div className="layerTable">
                <div className="layerTableRow layerTableHead">
                  <div>Step</div>
                  <div>Target</div>
                  <div>Δt</div>
                  <div>Shift</div>
                  <div>Status</div>
                </div>
                <div className="layerTableRow">
                  <div>Echo-12</div>
                  <div>Q2</div>
                  <div>0.46 μs</div>
                  <div>-0.02</div>
                  <div>OK</div>
                </div>
                <div className="layerTableRow">
                  <div>CR-211</div>
                  <div>Q4 → Q6</div>
                  <div>0.71 μs</div>
                  <div>+0.04</div>
                  <div>OK</div>
                </div>
                <div className="layerTableRow">
                  <div>ZZ-114</div>
                  <div>Q1 ↔ Q5</div>
                  <div>0.88 μs</div>
                  <div>+0.09</div>
                  <div>WARN</div>
                </div>
                <div className="layerTableRow">
                  <div>DR-402</div>
                  <div>Q7</div>
                  <div>0.31 μs</div>
                  <div>-0.01</div>
                  <div>OK</div>
                </div>
                <div className="layerTableRow">
                  <div>XY-009</div>
                  <div>Q3</div>
                  <div>0.25 μs</div>
                  <div>+0.02</div>
                  <div>OK</div>
                </div>
              </div>
            </div>
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Operator Log</div>
              <div className="layerTinyNote">
                Drift compensation applied at 21:18. Residual phase noise within 0.6°; recalc queued for Q5 after cryo stabilization.
              </div>
            </div>
            <div className="layerFootnote">
              Scheduler locked to 0.4 ns resolution · Guard bands active across couplers
            </div>
          </article>
        </HorizontalStack>
        <div className="horizontalNav">
          <button
            type="button"
            className="layeredBtn"
            onClick={handleControlPrevSlide}
            disabled={controlSlideIndex === 0}
          >
            Previous slide
          </button>
          <div className="horizontalNavLabel">
            Slide {controlSlideIndex + 1} / {controlSlideCount}
          </div>
          <button
            type="button"
            className="layeredBtn"
            onClick={handleControlNextSlide}
            disabled={controlSlideIndex === controlSlideCount - 1}
          >
            Next slide
          </button>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerMeta">
            <div>Quantum Materials Lab</div>
            <div>Layer 03 / Deep Field</div>
          </div>
          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Josephson Junction Survey</h2>
              <p className="layerSubtitle">Al/AlOx/Al stacks · 9 wafers · 10 nm barrier control</p>
            </div>
            <div className="layerBadge">Lot J-731</div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Yield</div>
              <div className="layerCardValue">86.2%</div>
              <div className="layerCardHint">Within spec @ 4K</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Critical Current</div>
              <div className="layerCardValue">5.4 ± 0.7 μA</div>
              <div className="layerCardHint">Median per die</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Subgap Ratio</div>
              <div className="layerCardValue">11.8</div>
              <div className="layerCardHint">Target &gt; 10</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Oxide Uniformity</div>
              <div className="layerCardValue">±1.6%</div>
              <div className="layerCardHint">Across 200 mm</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">I-V Curve Summary</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="IV curve summary">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <path
                  d="M18 96 L64 90 L110 82 L156 68 L202 52 L248 38 L294 30 L342 26"
                  className="layerChartLine"
                />
                <g className="layerChartGrid">
                  <line x1="12" y1="30" x2="348" y2="30" />
                  <line x1="12" y1="60" x2="348" y2="60" />
                  <line x1="12" y1="90" x2="348" y2="90" />
                </g>
              </svg>
              <div className="layerTinyNote">Normal-state resistance median: 4.7 kΩ</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Micrograph Panel</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Junction micrograph">
                <rect x="18" y="18" width="124" height="124" rx="14" fill="rgba(200,205,215,0.08)" stroke="rgba(200,205,215,0.3)" />
                <rect x="34" y="34" width="92" height="18" rx="6" fill="rgba(200,205,215,0.2)" />
                <rect x="34" y="64" width="92" height="18" rx="6" fill="rgba(200,205,215,0.12)" />
                <rect x="34" y="94" width="92" height="18" rx="6" fill="rgba(200,205,215,0.16)" />
                <circle cx="56" cy="122" r="6" fill="rgba(200,205,215,0.3)" />
                <circle cx="104" cy="122" r="6" fill="rgba(200,205,215,0.3)" />
              </svg>
              <ul className="layerList">
                <li>Edge roughness: 2.1 nm</li>
                <li>Overlap tolerance: ±8 nm</li>
                <li>Void density: 0.7%</li>
              </ul>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Process Timeline</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Stage</div>
                <div>Tool</div>
                <div>Δt</div>
                <div>Shift</div>
                <div>QC</div>
              </div>
              <div className="layerTableRow">
                <div>Evap-01</div>
                <div>Chamber B</div>
                <div>12m</div>
                <div>+0.3</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>Ox-07</div>
                <div>Plasma C</div>
                <div>4m</div>
                <div>-0.2</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>Lift-02</div>
                <div>Solvent D</div>
                <div>18m</div>
                <div>+0.1</div>
                <div>WARN</div>
              </div>
              <div className="layerTableRow">
                <div>Inspect</div>
                <div>SEM 4</div>
                <div>6m</div>
                <div>+0.0</div>
                <div>OK</div>
              </div>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Notes</div>
            <div className="layerTinyNote">
              Barrier oxidation extended by 12s on wafer 6 to stabilize junction area; rework not required. Scatter reduced after bake temp trim.
            </div>
          </div>

          <div className="layerFootnote">Spec alignment holds · Next scan at 02:00 local</div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Logical Qubits</div>
              <div className="layerCardValue">12 / 16</div>
              <div className="layerCardHint">d=7 surface code</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Error Threshold</div>
              <div className="layerCardValue">1.1%</div>
              <div className="layerCardHint">Circuit level</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Syndrome Round</div>
              <div className="layerCardValue">4.2 μs</div>
              <div className="layerCardHint">Measurement time</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Syndrome Extraction</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="Syndrome heatmap">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <g className="layerChartGrid">
                  <line x1="12" y1="24" x2="348" y2="24" />
                  <line x1="12" y1="48" x2="348" y2="48" />
                  <line x1="12" y1="72" x2="348" y2="72" />
                  <line x1="12" y1="96" x2="348" y2="96" />
                </g>
                <g className="layerChartDots">
                  <circle cx="50" cy="40" r="3" fill="#ff6b6b" />
                  <circle cx="120" cy="60" r="4" fill="#4ecdc4" />
                  <circle cx="200" cy="30" r="2" fill="#45b7d1" />
                  <circle cx="280" cy="80" r="3" fill="#f9ca24" />
                  <circle cx="340" cy="50" r="2" fill="#6c5ce7" />
                </g>
              </svg>
              <div className="layerTinyNote">Parity checks: 89% success · Last correction at t=142.3 μs</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Error Distribution</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Error rate visualization">
                <defs>
                  <radialGradient id="errorGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffeaa7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d63031" stopOpacity="0.3" />
                  </radialGradient>
                </defs>
                <circle cx="80" cy="80" r="60" fill="url(#errorGrad)" />
                <circle cx="60" cy="70" r="8" fill="#e17055" />
                <circle cx="100" cy="90" r="6" fill="#e17055" />
                <circle cx="70" cy="100" r="4" fill="#e17055" />
                <line x1="80" y1="20" x2="80" y2="140" stroke="#636e72" strokeOpacity="0.5" />
                <line x1="20" y1="80" x2="140" y2="80" stroke="#636e72" strokeOpacity="0.5" />
              </svg>
              <ul className="layerList">
                <li>X-type errors: 0.8%</li>
                <li>Z-type errors: 1.2%</li>
                <li>Correlated pairs: 0.3%</li>
              </ul>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Logical vs Physical Error Rates</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Code Distance</div>
                <div>Physical p</div>
                <div>Logical p</div>
                <div>Threshold</div>
                <div>Status</div>
              </div>
              <div className="layerTableRow">
                <div>d=3</div>
                <div>0.8%</div>
                <div>2.1%</div>
                <div>10.9%</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>d=5</div>
                <div>1.1%</div>
                <div>0.03%</div>
                <div>10.9%</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>d=7</div>
                <div>1.4%</div>
                <div>8.2e-6</div>
                <div>10.9%</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Surface Code Performance</h2>
              <p className="layerSubtitle">Rotated lattice · 16 data qubits · d=7 distance</p>
            </div>
            <div className="layerBadge">ECC Run 047-C</div>
          </div>

          <div className="layerMeta">
            <div>Quantum Error Correction</div>
            <div>Layer 04 / Quaternary surface</div>
          </div>

          <div className="layerFootnote">
            Decoder convergence: 94% · Next syndrome extraction in 3.8 μs
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerMeta">
            <div>Quantum Algorithms</div>
            <div>Layer 05 / Quinary surface</div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">VQE Performance Metrics</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Iteration</div>
                <div>Energy (Ha)</div>
                <div>ΔE</div>
                <div>Fidelity</div>
                <div>Status</div>
              </div>
              <div className="layerTableRow">
                <div>0</div>
                <div>-1.247</div>
                <div>—</div>
                <div>0.12</div>
                <div>INIT</div>
              </div>
              <div className="layerTableRow">
                <div>50</div>
                <div>-1.823</div>
                <div>0.024</div>
                <div>0.87</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>100</div>
                <div>-1.847</div>
                <div>0.003</div>
                <div>0.94</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>150</div>
                <div>-1.851</div>
                <div>0.001</div>
                <div>0.96</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Ansatz Depth</div>
              <div className="layerCardValue">6 layers</div>
              <div className="layerCardHint">UCCSD-inspired</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Parameters</div>
              <div className="layerCardValue">48</div>
              <div className="layerCardHint">Trainable vars</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Convergence</div>
              <div className="layerCardValue">ε &lt; 0.01</div>
              <div className="layerCardHint">Energy threshold</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Circuit Shots</div>
              <div className="layerCardValue">8192</div>
              <div className="layerCardHint">Per evaluation</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Optimizer</div>
              <div className="layerCardValue">SPSA</div>
              <div className="layerCardHint">Gradient-free</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Energy Landscape</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="VQE optimization landscape">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <path
                  d="M12 110 L32 105 L52 95 L72 85 L92 70 L112 60 L132 50 L152 45 L172 35 L192 30 L212 25 L232 20 L252 18 L272 15 L292 12 L312 10 L332 8"
                  className="layerChartLine"
                />
                <g className="layerChartDots">
                  <circle cx="12" cy="110" r="2" />
                  <circle cx="52" cy="95" r="2" />
                  <circle cx="112" cy="60" r="3" fill="#00b894" />
                  <circle cx="172" cy="35" r="2" />
                  <circle cx="232" cy="20" r="2" />
                  <circle cx="292" cy="12" r="3" fill="#00b894" />
                  <circle cx="332" cy="8" r="2" />
                </g>
                <g className="layerChartGrid">
                  <line x1="12" y1="30" x2="348" y2="30" />
                  <line x1="12" y1="60" x2="348" y2="60" />
                  <line x1="12" y1="90" x2="348" y2="90" />
                </g>
              </svg>
              <div className="layerTinyNote">Local minima detected at iterations 112 and 298 · Gradient variance: 0.034</div>
            </div>
          </div>

          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Variational Quantum Eigensolver</h2>
              <p className="layerSubtitle">H2 molecule · 4 qubits · Hardware-efficient ansatz</p>
            </div>
            <div className="layerBadge">VQE Run 089-B</div>
          </div>

          <div className="layerFootnote">
            Classical optimizer stalled · Quantum subroutine fidelity: 0.91
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Quantum Key Distribution Network</h2>
              <p className="layerSubtitle">BB84 protocol · 8-node mesh · 45 km total span</p>
            </div>
            <div className="layerBadge">QKD Net 022-D</div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Network Topology</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="QKD network diagram">
                <circle cx="80" cy="80" r="50" fill="none" stroke="#636e72" strokeOpacity="0.3" />
                <circle cx="80" cy="30" r="6" fill="#0984e3" />
                <circle cx="120" cy="60" r="6" fill="#00b894" />
                <circle cx="120" cy="100" r="6" fill="#e17055" />
                <circle cx="80" cy="130" r="6" fill="#fdcb6e" />
                <circle cx="40" cy="100" r="6" fill="#e84393" />
                <circle cx="40" cy="60" r="6" fill="#6c5ce7" />
                <circle cx="80" cy="80" r="4" fill="#2d3436" />
                <line x1="80" y1="30" x2="80" y2="80" stroke="#0984e3" strokeOpacity="0.7" />
                <line x1="120" y1="60" x2="80" y2="80" stroke="#00b894" strokeOpacity="0.7" />
                <line x1="120" y1="100" x2="80" y2="80" stroke="#e17055" strokeOpacity="0.7" />
                <line x1="80" y1="130" x2="80" y2="80" stroke="#fdcb6e" strokeOpacity="0.7" />
                <line x1="40" y1="100" x2="80" y2="80" stroke="#e84393" strokeOpacity="0.7" />
                <line x1="40" y1="60" x2="80" y2="80" stroke="#6c5ce7" strokeOpacity="0.7" />
              </svg>
              <ul className="layerList">
                <li>Entanglement rate: 2.4 kHz</li>
                <li>Fidelity: 0.92</li>
                <li>Loss budget: 12 dB</li>
              </ul>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Key Rate History</div>
              <svg className="layerChart" viewBox="0 0 160 120" role="img" aria-label="QKD key rates chart">
                <rect x="0" y="0" width="160" height="120" rx="10" />
                <path
                  d="M8 112 L28 108 L48 95 L68 88 L88 82 L108 76 L128 70 L148 65"
                  className="layerChartLine"
                />
                <g className="layerChartDots">
                  <circle cx="8" cy="112" r="2" />
                  <circle cx="48" cy="95" r="3" fill="#00b894" />
                  <circle cx="88" cy="82" r="2" />
                  <circle cx="128" cy="70" r="2" />
                  <circle cx="148" cy="65" r="3" fill="#00b894" />
                </g>
              </svg>
              <div className="layerTinyNote">Peak rate: 1.2 Mbps · Average: 890 kbps</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Protocol Stats</div>
              <ul className="layerList">
                <li>Sifting efficiency: 0.47</li>
                <li>Quantum bit error: 0.028</li>
                <li>Privacy amplification: 512-bit</li>
              </ul>
              <div className="layerTinyNote">Last reconciliation: 2.1s · Success rate: 98.7%</div>
            </div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Active Links</div>
              <div className="layerCardValue">6 / 8</div>
              <div className="layerCardHint">Two in maintenance</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Secure Keys</div>
              <div className="layerCardValue">12.4 GB</div>
              <div className="layerCardHint">Total distributed</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Channel Loss</div>
              <div className="layerCardValue">8.2 dB</div>
              <div className="layerCardHint">Average attenuation</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Eve Detection</div>
              <div className="layerCardValue">0.0</div>
              <div className="layerCardHint">No intrusions</div>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Key Exchange Log</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Link</div>
                <div>Key Length</div>
                <div>Time</div>
                <div>Error Rate</div>
                <div>Status</div>
              </div>
              <div className="layerTableRow">
                <div>A↔B</div>
                <div>256-bit</div>
                <div>1.2s</div>
                <div>0.021</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>B↔C</div>
                <div>512-bit</div>
                <div>2.8s</div>
                <div>0.034</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>C↔D</div>
                <div>256-bit</div>
                <div>1.9s</div>
                <div>0.018</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerMeta">
            <div>Quantum Networking</div>
            <div>Layer 06 / Senary surface</div>
          </div>

          <div className="layerFootnote">
            Entanglement swapping active · Next key refresh in 45s
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Qubit Count</div>
              <div className="layerCardValue">64</div>
              <div className="layerCardHint">Fixed-frequency transmons</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">T1 Median</div>
              <div className="layerCardValue">28.4 μs</div>
              <div className="layerCardHint">Energy relaxation time</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Connectivity</div>
              <div className="layerCardValue">Heavy-hex</div>
              <div className="layerCardHint">6 nearest neighbors</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Qubit Array Layout</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Superconducting qubit array">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="#636e72" opacity="0.3" />
                    <line x1="10" y1="0" x2="10" y2="20" stroke="#636e72" strokeOpacity="0.2" />
                    <line x1="0" y1="10" x2="20" y2="10" stroke="#636e72" strokeOpacity="0.2" />
                  </pattern>
                </defs>
                <rect x="10" y="10" width="140" height="140" fill="url(#grid)" />
                <circle cx="40" cy="40" r="3" fill="#00b894" />
                <circle cx="60" cy="40" r="3" fill="#00b894" />
                <circle cx="50" cy="50" r="3" fill="#0984e3" />
                <circle cx="70" cy="50" r="3" fill="#00b894" />
                <circle cx="40" cy="60" r="3" fill="#0984e3" />
                <circle cx="60" cy="60" r="3" fill="#00b894" />
                <circle cx="80" cy="60" r="3" fill="#00b894" />
                <circle cx="50" cy="70" r="3" fill="#0984e3" />
                <circle cx="70" cy="70" r="3" fill="#00b894" />
                <line x1="40" y1="40" x2="50" y2="50" stroke="#00b894" strokeOpacity="0.6" />
                <line x1="50" y1="50" x2="60" y2="40" stroke="#00b894" strokeOpacity="0.6" />
                <line x1="50" y1="50" x2="40" y2="60" stroke="#0984e3" strokeOpacity="0.6" />
              </svg>
              <ul className="layerList">
                <li>Active qubits: 58/64</li>
                <li>Coupler count: 96</li>
                <li>Control lines: 128</li>
              </ul>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Qubit Performance</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Qubit</div>
                <div>T1 (μs)</div>
                <div>T2 (μs)</div>
                <div>Readout</div>
                <div>Status</div>
              </div>
              <div className="layerTableRow">
                <div>Q01</div>
                <div>32.1</div>
                <div>18.7</div>
                <div>0.94</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>Q12</div>
                <div>28.9</div>
                <div>22.3</div>
                <div>0.89</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>Q25</div>
                <div>15.2</div>
                <div>12.1</div>
                <div>0.76</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerMeta">
            <div>Quantum Hardware</div>
            <div>Layer 07 / Septenary surface</div>
          </div>

          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Superconducting Qubit Architecture</h2>
              <p className="layerSubtitle">Heavy-hex lattice · 64 qubits · 20 mK operation</p>
            </div>
            <div className="layerBadge">HW Arch 015-F</div>
          </div>

          <div className="layerFootnote">
            Gate fidelities above 99.5% · Next calibration sweep in 2h
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Simulation Notes</div>
            <div className="layerTinyNote">
              Trotter-Suzuki decomposition applied with dt=0.01. Ground state preparation converged after 84 sweeps. Critical point at J=0.89 identified with Binder cumulant crossing.
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Hamiltonian Evolution</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="Time evolution chart">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <path
                  d="M12 100 L42 85 L72 70 L102 55 L132 45 L162 40 L192 35 L222 30 L252 28 L282 25 L312 22 L342 20"
                  className="layerChartLine"
                />
                <g className="layerChartGrid">
                  <line x1="12" y1="30" x2="348" y2="30" />
                  <line x1="12" y1="60" x2="348" y2="60" />
                  <line x1="12" y1="90" x2="348" y2="90" />
                </g>
              </svg>
              <div className="layerTinyNote">Energy conservation: ΔE/E = 1.2e-4 · Time step: 0.01</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Entanglement Entropy</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Entanglement entropy visualization">
                <rect x="20" y="20" width="120" height="120" rx="10" fill="rgba(200,205,215,0.1)" />
                <path d="M40 120 L60 100 L80 90 L100 85 L120 80" stroke="#00b894" strokeWidth="3" fill="none" />
                <circle cx="40" cy="120" r="4" fill="#0984e3" />
                <circle cx="60" cy="100" r="4" fill="#0984e3" />
                <circle cx="80" cy="90" r="4" fill="#0984e3" />
                <circle cx="100" cy="85" r="4" fill="#0984e3" />
                <circle cx="120" cy="80" r="4" fill="#0984e3" />
                <text x="20" y="50" fontSize="12" fill="#636e72">S(L)</text>
                <text x="140" y="150" fontSize="12" fill="#636e72">L</text>
              </svg>
              <ul className="layerList">
                <li>von Neumann entropy: 1.87</li>
                <li>Area law violation: 0.12</li>
                <li>Correlation length: 4.2</li>
              </ul>
            </div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">System Size</div>
              <div className="layerCardValue">L=24</div>
              <div className="layerCardHint">1D Heisenberg chain</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Interaction</div>
              <div className="layerCardValue">J=1.0</div>
              <div className="layerCardHint">Nearest neighbor</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Field</div>
              <div className="layerCardValue">h=0.5</div>
              <div className="layerCardHint">Transverse field</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Precision</div>
              <div className="layerCardValue">ε=1e-8</div>
              <div className="layerCardHint">Convergence threshold</div>
            </div>
          </div>

          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Many-Body Quantum Simulation</h2>
              <p className="layerSubtitle">Transverse field Ising model · MPS representation · 24 sites</p>
            </div>
            <div className="layerBadge">Sim Run 033-G</div>
          </div>

          <div className="layerMeta">
            <div>Quantum Simulation</div>
            <div>Layer 08 / Octonary surface</div>
          </div>

          <div className="layerFootnote">
            Bond dimension D=128 · Trotter error: 0.034% per step
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Post-Quantum Cryptography Suite</h2>
              <p className="layerSubtitle">Lattice-based schemes · 4096-bit keys · NIST Round 3 finalists</p>
            </div>
            <div className="layerBadge">PQ Crypto 018-H</div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Key Size</div>
              <div className="layerCardValue">4 KB</div>
              <div className="layerCardHint">Public key length</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Security Level</div>
              <div className="layerCardValue">Level 5</div>
              <div className="layerCardHint">128-bit quantum security</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Signature Size</div>
              <div className="layerCardValue">2.7 KB</div>
              <div className="layerCardHint">Dilithium compact</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">KEM Rate</div>
              <div className="layerCardValue">256-bit</div>
              <div className="layerCardHint">Kyber-1024</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Performance</div>
              <div className="layerCardValue">12.4 ms</div>
              <div className="layerCardHint">Key generation time</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Attack Vector Analysis</div>
              <svg className="layerChart" viewBox="0 0 160 120" role="img" aria-label="Security threat landscape">
                <rect x="0" y="0" width="160" height="120" rx="10" />
                <g className="layerChartDots">
                  <circle cx="30" cy="40" r="5" fill="#e17055" />
                  <circle cx="70" cy="60" r="4" fill="#fdcb6e" />
                  <circle cx="110" cy="30" r="6" fill="#00b894" />
                  <circle cx="140" cy="80" r="3" fill="#0984e3" />
                </g>
                <text x="25" y="100" fontSize="10" fill="#636e72">Grover</text>
                <text x="65" y="100" fontSize="10" fill="#636e72">Shor</text>
                <text x="105" y="100" fontSize="10" fill="#636e72">Lattice</text>
                <text x="135" y="100" fontSize="10" fill="#636e72">Hash</text>
              </svg>
              <div className="layerTinyNote">Threat levels: High (Shor), Medium (Grover), Low (Lattice/Hash)</div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Key Strength Visualization</div>
              <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Cryptographic strength diagram">
                <circle cx="80" cy="80" r="60" fill="none" stroke="#00b894" strokeWidth="4" strokeOpacity="0.3" />
                <circle cx="80" cy="80" r="40" fill="none" stroke="#0984e3" strokeWidth="4" strokeOpacity="0.5" />
                <circle cx="80" cy="80" r="20" fill="none" stroke="#e17055" strokeWidth="4" strokeOpacity="0.7" />
                <circle cx="80" cy="80" r="50" fill="#00b894" fillOpacity="0.1" />
                <circle cx="80" cy="80" r="30" fill="#0984e3" fillOpacity="0.1" />
                <circle cx="80" cy="80" r="10" fill="#e17055" fillOpacity="0.2" />
                <text x="75" y="45" fontSize="12" fill="#636e72">256b</text>
                <text x="75" y="65" fontSize="12" fill="#636e72">128b</text>
                <text x="75" y="85" fontSize="12" fill="#636e72">64b</text>
              </svg>
              <ul className="layerList">
                <li>Classical: 128-bit</li>
                <li>Quantum: 256-bit</li>
                <li>Post-quantum: 512-bit</li>
              </ul>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Protocol Comparison</div>
              <div className="layerTinyNote">Falcon signatures: 1.2x smaller than Dilithium. Kyber KEM: 2.1x faster than Saber. All schemes pass NIST validation.</div>
            </div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Security Assessment</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Scheme</div>
                <div>Category</div>
                <div>Security</div>
                <div>Status</div>
                <div>NIST</div>
              </div>
              <div className="layerTableRow">
                <div>Dilithium</div>
                <div>Signature</div>
                <div>Level 3</div>
                <div>OK</div>
                <div>Finalist</div>
              </div>
              <div className="layerTableRow">
                <div>Kyber</div>
                <div>KEM</div>
                <div>Level 3</div>
                <div>OK</div>
                <div>Standard</div>
              </div>
              <div className="layerTableRow">
                <div>Falcon</div>
                <div>Signature</div>
                <div>Level 5</div>
                <div>WARN</div>
                <div>Alternate</div>
              </div>
            </div>
          </div>

          <div className="layerMeta">
            <div>Quantum Security</div>
            <div>Layer 09 / Nonary surface</div>
          </div>

          <div className="layerFootnote">
            Migration path established · Legacy RSA keys deprecated
          </div>
        </div>
      </Layer>
      <Layer>
        <div className="layerPanel">
          <div className="layerMeta">
            <div>Quantum Machine Learning</div>
            <div>Layer 10 / Denary surface</div>
          </div>

          <div className="layerPanelBlock">
            <div className="layerSectionTitle">Model Performance Metrics</div>
            <div className="layerTable">
              <div className="layerTableRow layerTableHead">
                <div>Model</div>
                <div>Dataset</div>
                <div>Accuracy</div>
                <div>Parameters</div>
                <div>Status</div>
              </div>
              <div className="layerTableRow">
                <div>QNN-4</div>
                <div>Iris</div>
                <div>97.3%</div>
                <div>24</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>QCNN-8</div>
                <div>MNIST</div>
                <div>94.1%</div>
                <div>64</div>
                <div>OK</div>
              </div>
              <div className="layerTableRow">
                <div>VQC-12</div>
                <div>Wine</div>
                <div>89.7%</div>
                <div>48</div>
                <div>WARN</div>
              </div>
            </div>
          </div>

          <div className="layerGrid">
            <div className="layerCard">
              <div className="layerCardLabel">Ansatz Layers</div>
              <div className="layerCardValue">6</div>
              <div className="layerCardHint">Hardware-efficient</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Training Epochs</div>
              <div className="layerCardValue">250</div>
              <div className="layerCardHint">Converged at 180</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Quantum Advantage</div>
              <div className="layerCardValue">1.8x</div>
              <div className="layerCardHint">vs classical baseline</div>
            </div>
            <div className="layerCard">
              <div className="layerCardLabel">Circuit Depth</div>
              <div className="layerCardValue">42</div>
              <div className="layerCardHint">Gates per layer</div>
            </div>
          </div>

          <div className="layerRow">
            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Training Loss Curve</div>
              <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="QML training loss curve">
                <rect x="0" y="0" width="360" height="120" rx="10" />
                <path
                  d="M12 108 L42 95 L72 82 L102 68 L132 55 L162 45 L192 38 L222 32 L252 28 L282 25 L312 22 L342 20"
                  className="layerChartLine"
                />
                <g className="layerChartDots">
                  <circle cx="12" cy="108" r="2" />
                  <circle cx="72" cy="82" r="3" fill="#00b894" />
                  <circle cx="162" cy="45" r="2" />
                  <circle cx="252" cy="28" r="3" fill="#00b894" />
                  <circle cx="342" cy="20" r="2" />
                </g>
                <g className="layerChartGrid">
                  <line x1="12" y1="30" x2="348" y2="30" />
                  <line x1="12" y1="60" x2="348" y2="60" />
                  <line x1="12" y1="90" x2="348" y2="90" />
                </g>
              </svg>
              <div className="layerTinyNote">Loss plateau reached at epoch 180 · Validation accuracy: 96.2%</div>
            </div>
          </div>

          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Quantum Neural Network Training</h2>
              <p className="layerSubtitle">Variational circuits · 8-qubit ansatz · Gradient-based optimization</p>
            </div>
            <div className="layerBadge">QML Run 045-I</div>
          </div>

          <div className="layerFootnote">
            Kernel method comparison: 2.3x speedup · Next: quantum kernel alignment
          </div>
        </div>
      </Layer>
    </LayeredScene>
  )
}

export default App
