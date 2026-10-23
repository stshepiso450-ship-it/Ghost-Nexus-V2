import React, { useEffect, useRef, useState } from "react";
import "./AIScanner.css";

const API = (
  import.meta.env.VITE_API_URL || "http://192.168.68.106:8000"
).replace(/\/$/, "");

const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function AIScanner() {
  const [chart, setChart] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [tradeMessage, setTradeMessage] = useState("");

  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    checkGhostAI();

    const interval = setInterval(() => {
      checkGhostAI();
    }, 5000);

    return () => {
      clearInterval(interval);

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  async function checkGhostAI() {
    try {
      const response = await fetch(`${API}/ai/status`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (mountedRef.current) {
          setBackendOnline(false);
        }

        return;
      }

      const data = await response.json();

      console.log("GHOST AI STATUS:", data);

      const online =
        data?.status === "ONLINE" &&
        data?.market_data === "ONLINE" &&
        data?.metaapi === "CONNECTED";

      if (mountedRef.current) {
        setBackendOnline(online);
      }
    } catch (err) {
      console.error("GHOST AI STATUS ERROR:", err);

      if (mountedRef.current) {
        setBackendOnline(false);
      }
    }
  }

  function validateImage(file) {
    if (!file) {
      return "Please select a chart image.";
    }

    if (!file.type?.startsWith("image/")) {
      return "Only image files are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Chart image must be smaller than 15MB.";
    }

    return null;
  }

  function loadChart(file) {
    const validation = validateImage(file);

    if (validation) {
      setError(validation);
      return;
    }

    setError("");
    setResult(null);
    setTradeMessage("");
    setProgress(0);

    if (chart?.preview) {
      URL.revokeObjectURL(chart.preview);
    }

    const preview = URL.createObjectURL(file);

    setChart({
      file,
      preview,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (file) {
      loadChart(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      loadChart(file);
    }
  }

  function openFilePicker() {
    if (scanning) {
      return;
    }

    fileInputRef.current?.click();
  }

  function removeChart() {
    if (chart?.preview) {
      URL.revokeObjectURL(chart.preview);
    }

    setChart(null);
    setResult(null);
    setError("");
    setProgress(0);
    setTradeMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function startScan() {
    if (!chart?.file) {
      setError("Upload a trading chart first.");
      return;
    }

    if (scanning) {
      return;
    }

    setError("");
    setResult(null);
    setTradeMessage("");
    setScanning(true);
    setProgress(0);

    let currentProgress = 0;

    progressTimerRef.current = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 2;

      if (currentProgress >= 94) {
        currentProgress = 94;

        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (mountedRef.current) {
        setProgress(currentProgress);
      }
    }, 250);

    try {
      const statusResponse = await fetch(`${API}/ai/status`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!statusResponse.ok) {
        throw new Error(
          `Ghost AI server returned HTTP ${statusResponse.status}`
        );
      }

      const statusData = await statusResponse.json();

      console.log("GHOST AI SERVER:", statusData);

      const scannerOnline =
        statusData?.status === "ONLINE" &&
        statusData?.market_data === "ONLINE" &&
        statusData?.metaapi === "CONNECTED";

      if (!scannerOnline) {
        const apiStatus = statusData?.status || "UNKNOWN";
        const metaapiStatus = statusData?.metaapi || "UNKNOWN";
        const marketDataStatus =
          statusData?.market_data || "UNKNOWN";

        throw new Error(
          `Ghost AI is not ready. API: ${apiStatus} | MetaAPI: ${metaapiStatus} | Market Data: ${marketDataStatus}`
        );
      }

      setBackendOnline(true);

      const formData = new FormData();

      formData.append("image", chart.file);
      formData.append("strategy", "Sniper");
      formData.append("lot", "0.01");
      formData.append("max_trades", "5");

      console.log(
        "GHOST AI: Sending chart to:",
        `${API}/ai/analyze`
      );

      const response = await fetch(`${API}/ai/analyze`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      console.log(
        "GHOST AI HTTP STATUS:",
        response.status
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Ghost AI returned an invalid JSON response."
        );
      }

      console.log("GHOST AI ANALYSIS:", data);

      if (!response.ok) {
        const serverMessage =
          typeof data?.detail === "string"
            ? data.detail
            : data?.detail
              ? JSON.stringify(data.detail)
              : `Ghost AI returned HTTP ${response.status}`;

        throw new Error(serverMessage);
      }

      if (
        data?.success === false ||
        data?.status === "error"
      ) {
        throw new Error(
          data?.message ||
            data?.detail ||
            "Ghost AI could not complete the analysis."
        );
      }

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      setProgress(100);

      const market = data?.market || {};
      const trade = data?.trade || {};
      const ai = data?.ai || {};
      const explanation = ai?.explanation || {};
      const strategy = ai?.strategy || {};

      let signal =
        market?.signal ||
        ai?.decision ||
        data?.signal ||
        "WAIT";

      signal = String(signal).trim().toUpperCase();

      if (
        signal !== "BUY" &&
        signal !== "SELL" &&
        signal !== "WAIT"
      ) {
        signal = "WAIT";
      }

      let confidence = Number(
        data?.confidence ??
          ai?.confidence ??
          0
      );

      if (!Number.isFinite(confidence)) {
        confidence = 0;
      }

      confidence = Math.max(
        0,
        Math.min(100, confidence)
      );

      const reasons = Array.isArray(data?.reasons)
        ? data.reasons
        : Array.isArray(data?.data?.reasons)
          ? data.data.reasons
          : [];

      const analysis = {
        symbol:
          market?.symbol ||
          data?.symbol ||
          "UNKNOWN",

        signal,

        confidence,

        entry:
          trade?.entry ??
          data?.entry ??
          null,

        stopLoss:
          trade?.stop_loss ??
          data?.sl ??
          null,

        takeProfit:
          trade?.take_profit ??
          data?.tp ??
          null,

        lot:
          trade?.lot ??
          data?.lot ??
          null,

        riskReward:
          trade?.risk_reward ??
          data?.risk_reward ??
          null,

        marketCondition:
          ai?.market_condition ||
          data?.market_condition ||
          "NO_TRADE",

        summary:
          explanation?.summary ||
          data?.summary ||
          "No summary returned.",

        confirmation:
          explanation?.confirmation ||
          "",

        confidenceMessage:
          explanation?.confidence_message ||
          "",

        strategy:
          strategy?.mode ||
          data?.strategy ||
          "Sniper",

        strategyDescription:
          strategy?.description ||
          "",

        reasons,

        risk:
          data?.risk ||
          data?.data?.risk ||
          "UNKNOWN",

        timestamp:
          ai?.timestamp ||
          data?.timestamp ||
          null,

        engine:
          data?.engine ||
          data?.data?.engine ||
          {},
      };

      console.log(
        "NORMALIZED REAL RESULT:",
        analysis
      );

      setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }

        setResult(analysis);
        setScanning(false);
      }, 700);
    } catch (err) {
      console.error(
        "GHOST AI SCANNER ERROR:",
        err
      );

      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      if (mountedRef.current) {
        setScanning(false);
        setProgress(0);

        setError(
          err?.message ||
            "Ghost AI could not connect to the scanner server."
        );
      }
    }
  }

  async function placeTrade() {
    if (!result) {
      return;
    }

    if (
      result.signal !== "BUY" &&
      result.signal !== "SELL"
    ) {
      setTradeMessage(
        "There is no executable BUY or SELL signal."
      );

      return;
    }

    /*
     * Deliberately does not fake execution.
     *
     * The real execution chain should be:
     *
     * Ghost Nexus
     *      ↓
     * FastAPI
     *      ↓
     * MetaAPI
     *      ↓
     * Customer MT5
     *
     * Connect the button to the verified backend
     * trade endpoint once its request schema is confirmed.
     */

    setTradeMessage(
      `Confirmed ${result.signal} signal for ${result.symbol}. Real trade execution endpoint is not connected yet.`
    );
  }

  function formatValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    if (typeof value === "number") {
      return Number.isInteger(value)
        ? String(value)
        : value.toFixed(2);
    }

    return String(value);
  }

  function getSignalClass() {
    if (!result) {
      return "";
    }

    if (result.signal === "BUY") {
      return "buy";
    }

    if (result.signal === "SELL") {
      return "sell";
    }

    return "wait";
  }

  return (
    <div className="ai-scanner-page">
      <header className="scanner-header">
        <div className="scanner-header-content">
          <div className="scanner-eyebrow">
            GHOST NEXUS // VISION ENGINE
          </div>

          <h1>AI Scanner</h1>

          <p>
            Upload a trading chart and let Ghost AI
            analyze the market before generating a
            signal.
          </p>
        </div>

        <div
          className={`scanner-online ${
            backendOnline ? "online" : "offline"
          }`}
        >
          <span />
          {backendOnline
            ? "AI ONLINE"
            : "AI OFFLINE"}
        </div>
      </header>

      <section className="ai-core-card">
        <div
          className={`ai-core ${
            dragActive ? "dragging" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="core-ring core-ring-1" />
          <div className="core-ring core-ring-2" />
          <div className="core-ring core-ring-3" />

          <div className="core-orbit orbit-a">
            <i />
          </div>

          <div className="core-orbit orbit-b">
            <i />
          </div>

          <div
            className={`chart-sphere ${
              dragActive ? "drag-active" : ""
            }`}
          >
            {chart ? (
              <>
                <img
                  src={chart.preview}
                  alt="Trading chart"
                  className="sphere-chart"
                />

                <div className="sphere-overlay" />
                <div className="sphere-grid" />

                <div className="network-line network-1" />
                <div className="network-line network-2" />
                <div className="network-line network-3" />

                <div className="network-node node-a" />
                <div className="network-node node-b" />
                <div className="network-node node-c" />
                <div className="network-node node-d" />
                <div className="network-node node-e" />
                <div className="network-node node-f" />

                {scanning && (
                  <div className="scanner-laser" />
                )}

                <div className="sphere-center">
                  {scanning ? (
                    <>
                      <div className="scanner-pulse">
                        AI
                      </div>

                      <small>ANALYZING</small>

                      <strong>
                        {progress}%
                      </strong>
                    </>
                  ) : result ? (
                    <>
                      <div className="scanner-complete">
                        ✓
                      </div>

                      <small>COMPLETE</small>
                    </>
                  ) : (
                    <>
                      <div className="scanner-ready">
                        AI
                      </div>

                      <small>READY</small>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-sphere">
                <div className="empty-ai">AI</div>

                <span>DROP CHART</span>

                <small>
                  OR UPLOAD BELOW
                </small>
              </div>
            )}
          </div>

          <div className="ai-core-status">
            <strong>
              {scanning
                ? `SCANNING ${progress}%`
                : result
                  ? "ANALYSIS COMPLETE"
                  : "GHOST AI READY"}
            </strong>

            <span>
  {backendOnline ? "MetaAPI market data connected" : ""}
</span>
          </div>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        hidden
      />

      <div className="scanner-controls">
        <button
          type="button"
          className="upload-button"
          onClick={openFilePicker}
          disabled={scanning}
        >
          {chart
            ? "CHANGE CHART"
            : "UPLOAD CHART"}
        </button>

        <button
          type="button"
          className="analyze-button"
          onClick={startScan}
          disabled={
            !chart ||
            scanning ||
            !backendOnline
          }
        >
          {scanning
            ? `ANALYZING ${progress}%`
            : "START AI ANALYSIS"}
        </button>
      </div>

      {chart && (
        <div className="chart-file-info">
          <div className="chart-file-details">
            <span>CHART</span>

            <strong>{chart.name}</strong>
          </div>

          <button
            type="button"
            onClick={removeChart}
            disabled={scanning}
          >
            REMOVE
          </button>
        </div>
      )}

      {error && (
        <div className="scanner-error">
          <strong>GHOST AI ERROR</strong>

          <span>{error}</span>
        </div>
      )}

      {result && (
        <section className="trade-signal">
          <div className="signal-top">
            <div>
              <span>GHOST AI SIGNAL</span>

              <h2>{result.symbol}</h2>
            </div>

            <div
              className={`signal-badge ${getSignalClass()}`}
            >
              {result.signal}
            </div>
          </div>

          <div className="signal-condition">
            <span>MARKET CONDITION</span>

            <strong>
              {result.marketCondition}
            </strong>
          </div>

          <div className="signal-confidence">
            <div>
              <span>AI CONFIDENCE</span>

              <strong>
                {result.confidence}%
              </strong>
            </div>

            <div className="confidence-track">
              <div
                style={{
                  width: `${result.confidence}%`,
                }}
              />
            </div>
          </div>

          <div className="trade-levels">
            <div>
              <span>ENTRY</span>

              <strong>
                {formatValue(result.entry)}
              </strong>
            </div>

            <div>
              <span>STOP LOSS</span>

              <strong>
                {formatValue(result.stopLoss)}
              </strong>
            </div>

            <div>
              <span>TAKE PROFIT</span>

              <strong>
                {formatValue(result.takeProfit)}
              </strong>
            </div>
          </div>

          <div className="trade-levels">
            <div>
              <span>LOT</span>

              <strong>
                {formatValue(result.lot)}
              </strong>
            </div>

            <div>
              <span>RISK / REWARD</span>

              <strong>
                {formatValue(result.riskReward)}
              </strong>
            </div>

            <div>
              <span>RISK</span>

              <strong>{result.risk}</strong>
            </div>
          </div>

          <div className="analysis-reasons">
            <h3>AI ANALYSIS</h3>

            {result.summary && (
              <div className="analysis-reason">
                <span>◆</span>

                <p>{result.summary}</p>
              </div>
            )}

            {result.confirmation && (
              <div className="analysis-reason">
                <span>◆</span>

                <p>
                  Confirmation:{" "}
                  {result.confirmation}
                </p>
              </div>
            )}

            {result.confidenceMessage && (
              <div className="analysis-reason">
                <span>◆</span>

                <p>
                  {result.confidenceMessage}
                </p>
              </div>
            )}

            {result.reasons.map(
              (reason, index) => (
                <div
                  className="analysis-reason"
                  key={`${String(
                    reason
                  )}-${index}`}
                >
                  <span>◆</span>

                  <p>{String(reason)}</p>
                </div>
              )
            )}
          </div>

          <div className="scanner-meta">
            <span>STRATEGY</span>

            <strong>
              {result.strategy}
            </strong>
          </div>

          {result.strategyDescription && (
            <div className="scanner-meta">
              <span>MODE</span>

              <strong>
                {result.strategyDescription}
              </strong>
            </div>
          )}

          {result.signal === "BUY" ||
          result.signal === "SELL" ? (
            <button
              type="button"
              className="place-trade"
              onClick={placeTrade}
            >
              PLACE {result.signal} TRADE
            </button>
          ) : (
            <button
              type="button"
              className="place-trade"
              disabled
            >
              WAIT — NO TRADE CONFIRMED
            </button>
          )}

          {tradeMessage && (
            <div className="scanner-trade-message">
              {tradeMessage}
            </div>
          )}
        </section>
      )}
    </div>
  );
}