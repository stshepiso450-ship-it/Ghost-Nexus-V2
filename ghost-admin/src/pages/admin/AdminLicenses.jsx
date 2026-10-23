import React, {
  useEffect,
  useState,
} from "react";

import {
  KeyRound,
  Plus,
  Copy,
  Download,
  Search,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

import "./AdminLicenses.css";


const API_BASE_URL =
  "http://127.0.0.1:8000";


export default function AdminLicenses() {

  const [licenses, setLicenses] =
    useState([]);

  const [eas, setEas] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      ea: "",
      quantity: 1,
      duration: "30",
    });

  const [generatedBatch, setGeneratedBatch] =
    useState(null);


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = async () => {

    setLoading(true);
    setError("");

    try {

      const [
        licensesResponse,
        easResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/admin/licenses`
        ),
        fetch(
          `${API_BASE_URL}/admin/ea`
        ),
      ]);


      if (!licensesResponse.ok) {
        throw new Error(
          "Failed to load licenses."
        );
      }


      if (!easResponse.ok) {
        throw new Error(
          "Failed to load EAs."
        );
      }


      const licensesData =
        await licensesResponse.json();

      const easData =
        await easResponse.json();


      const loadedLicenses =
        Array.isArray(
          licensesData.licenses
        )
          ? licensesData.licenses
          : [];


      const loadedEas =
        Array.isArray(
          easData.active_ea
        )
          ? easData.active_ea
          : [];


      setLicenses(
        loadedLicenses
      );


      setEas(
        loadedEas
      );


      // ------------------------------------------------------
      // Automatically select first ACTIVE EA
      // ------------------------------------------------------

      if (
        !form.ea &&
        loadedEas.length > 0
      ) {

        setForm((current) => ({
          ...current,
          ea:
            loadedEas[0].ea_id,
        }));

      }

    } catch (requestError) {

      console.error(
        requestError
      );

      setError(
        requestError.message ||
        "Failed to load license data."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadData();

  }, []);


  // ==========================================================
  // FORM
  // ==========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm((current) => ({
      ...current,
      [name]: value,
    }));

  };


  // ==========================================================
  // GENERATE REAL LICENSES
  // ==========================================================

  const generateLicenses = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    setGeneratedBatch(null);


    const quantity = Math.min(
      500,
      Math.max(
        1,
        Number(form.quantity)
      )
    );


    if (!form.ea) {

      setError(
        "Select an active EA first."
      );

      return;
    }


    setGenerating(true);


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/admin/licenses/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ea_id:
                form.ea,

              quantity,

              duration:
                form.duration,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        const message =
          typeof data.detail ===
          "string"
            ? data.detail
            : "Failed to generate licenses.";

        throw new Error(
          message
        );
      }


      const generated =
        Array.isArray(
          data.licenses
        )
          ? data.licenses
          : [];


      // ------------------------------------------------------
      // Put newest real licenses at the top.
      // ------------------------------------------------------

      setLicenses(
        (current) => [
          ...generated,
          ...current,
        ]
      );


      setGeneratedBatch({
        batchId:
          data.batch_id,

        quantity:
          data.quantity,

        licenses:
          generated,
      });


      // ------------------------------------------------------
      // Reset quantity but keep selected EA.
      // ------------------------------------------------------

      setForm(
        (current) => ({
          ...current,
          quantity: 1,
        })
      );


    } catch (requestError) {

      console.error(
        requestError
      );

      setError(
        requestError.message ||
        "Failed to generate licenses."
      );

    } finally {

      setGenerating(false);

    }
  };


  // ==========================================================
  // COPY LICENSE
  // ==========================================================

  const copyKey = async (
    key
  ) => {

    try {

      await navigator.clipboard.writeText(
        key
      );

    } catch (copyError) {

      console.error(
        copyError
      );

    }
  };


  // ==========================================================
  // EXPORT CURRENT BATCH
  // ==========================================================

  const exportBatch = () => {

    if (
      !generatedBatch ||
      !generatedBatch.licenses
    ) {
      return;
    }


    const content =
      generatedBatch.licenses
        .map(
          (license) =>
            license.license_key ||
            license.key
        )
        .join("\n");


    const blob =
      new Blob(
        [content],
        {
          type:
            "text/plain",
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href = url;

    link.download =
      `${
        generatedBatch.batchId
      }.txt`;


    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );
  };


  // ==========================================================
  // SEARCH
  // ==========================================================

  const searchValue =
    search
      .trim()
      .toLowerCase();


  const filteredLicenses =
    licenses.filter(
      (license) => {

        const key =
          String(
            license.license_key ||
            ""
          ).toLowerCase();


        const eaId =
          String(
            license.ea_id ||
            ""
          ).toLowerCase();


        const mentorId =
          String(
            license.mentor_id ||
            ""
          ).toLowerCase();


        return (
          key.includes(
            searchValue
          ) ||
          eaId.includes(
            searchValue
          ) ||
          mentorId.includes(
            searchValue
          )
        );
      }
    );


  // ==========================================================
  // FORMAT DURATION
  // ==========================================================

  const formatDuration = (
    license
  ) => {

    if (
      !license.expires_at
    ) {
      return "Lifetime";
    }


    const created =
      license.created_at
        ? new Date(
            license.created_at
          )
        : null;


    const expires =
      new Date(
        license.expires_at
      );


    if (
      !created ||
      Number.isNaN(
        created.getTime()
      ) ||
      Number.isNaN(
        expires.getTime()
      )
    ) {
      return "Timed";
    }


    const days =
      Math.round(
        (
          expires.getTime() -
          created.getTime()
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    return `${days} Days`;
  };


  // ==========================================================
  // EA NAME
  // ==========================================================

  const getEAName = (
    license
  ) => {

    const found =
      eas.find(
        (ea) =>
          ea.ea_id ===
          license.ea_id
      );


    return (
      found?.ea_name ||
      license.ea_id ||
      "Unknown EA"
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-licenses-page">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="admin-licenses-header">

        <div>

          <div className="admin-licenses-eyebrow">

            <KeyRound size={16} />

            LICENSE MANAGEMENT

          </div>


          <h1>
            Licenses
          </h1>


          <p>
            Generate, manage and distribute
            real Ghost Nexus EA license keys.
          </p>

        </div>


        <button
          type="button"
          className="license-refresh-button"
          onClick={loadData}
          disabled={loading}
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div className="license-error">

          <strong>
            License system error
          </strong>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ================================================== */}
      {/* GENERATOR */}
      {/* ================================================== */}

      <section className="license-generator">

        <div className="license-section-title">

          <div className="license-title-icon">

            <Plus size={19} />

          </div>


          <div>

            <h2>
              Generate License Batch
            </h2>


            <p>
              Generate real licenses that are
              stored in the Ghost Nexus database.
            </p>

          </div>

        </div>


        <form
          className="license-generator-form"
          onSubmit={generateLicenses}
        >

          {/* ============================================ */}
          {/* EA */}
          {/* ============================================ */}

          <div className="license-field">

            <label>
              EA
            </label>


            <select
              name="ea"
              value={form.ea}
              onChange={handleChange}
              disabled={
                generating ||
                eas.length === 0
              }
            >

              <option value="">
                Select Active EA
              </option>


              {eas.map(
                (ea) => (

                  <option
                    key={ea.ea_id}
                    value={ea.ea_id}
                  >
                    {ea.ea_name}
                    {" — "}
                    {ea.ea_id}
                  </option>

                )
              )}

            </select>


            {eas.length === 0 && (

              <small>
                No ACTIVE EAs are available.
                Approve an EA before generating
                licenses.
              </small>

            )}

          </div>


          {/* ============================================ */}
          {/* QUANTITY */}
          {/* ============================================ */}

          <div className="license-field">

            <label>
              Quantity
            </label>


            <input
              type="number"
              name="quantity"
              min="1"
              max="500"
              value={form.quantity}
              onChange={handleChange}
              disabled={
                generating
              }
            />


            <small>
              Maximum 500 licenses per EA.
            </small>

          </div>


          {/* ============================================ */}
          {/* DURATION */}
          {/* ============================================ */}

          <div className="license-field">

            <label>
              Duration
            </label>


            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              disabled={
                generating
              }
            >

              <option value="7">
                7 Days
              </option>

              <option value="30">
                30 Days
              </option>

              <option value="90">
                90 Days
              </option>

              <option value="180">
                180 Days
              </option>

              <option value="365">
                1 Year
              </option>

              <option value="lifetime">
                Lifetime
              </option>

            </select>

          </div>


          {/* ============================================ */}
          {/* BUTTON */}
          {/* ============================================ */}

          <button
            type="submit"
            className="generate-license-button"
            disabled={
              generating ||
              eas.length === 0 ||
              !form.ea
            }
          >

            {generating ? (
              <>
                <RefreshCw
                  size={17}
                  className="spin"
                />

                Generating...
              </>
            ) : (
              <>
                <KeyRound size={17} />

                Generate Licenses
              </>
            )}

          </button>

        </form>


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {generatedBatch && (

          <div className="batch-success">

            <div className="batch-success-icon">

              <CheckCircle size={20} />

            </div>


            <div className="batch-success-info">

              <strong>
                License batch generated
              </strong>


              <span>
                {generatedBatch.quantity}
                {" "}
                real licenses created in
                {" "}
                {generatedBatch.batchId}
              </span>

            </div>


            <button
              type="button"
              onClick={exportBatch}
            >

              <Download size={15} />

              Export Batch

            </button>

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* LICENSE LIST */}
      {/* ================================================== */}

      <section className="license-list-section">

        <div className="license-list-header">

          <div>

            <h2>
              License Keys
            </h2>


            <span>
              {licenses.length}
              {" "}
              total licenses
            </span>

          </div>


          <div className="license-search">

            <Search size={16} />


            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search license, EA or mentor..."
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (

          <div className="license-empty">

            <RefreshCw
              size={38}
              className="spin"
            />

            <h3>
              Loading licenses...
            </h3>

            <p>
              Connecting to Ghost Nexus API.
            </p>

          </div>

        ) : filteredLicenses.length === 0 ? (

          /* =============================================== */
          /* EMPTY */
          /* =============================================== */

          <div className="license-empty">

            <KeyRound size={38} />

            <h3>
              No licenses found
            </h3>

            <p>
              Generated licenses will appear here.
            </p>

          </div>

        ) : (

          /* =============================================== */
          /* TABLE */
          /* =============================================== */

          <div className="license-table-wrapper">

            <table className="license-table">

              <thead>

                <tr>

                  <th>
                    License Key
                  </th>

                  <th>
                    EA
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Mentor
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredLicenses
                  .slice(0, 100)
                  .map(
                    (license) => (

                      <tr
                        key={
                          license.id
                        }
                      >

                        <td>

                          <code>
                            {
                              license.license_key
                            }
                          </code>

                        </td>


                        <td>

                          <div>
                            {
                              getEAName(
                                license
                              )
                            }
                          </div>

                          <small>
                            {
                              license.ea_id
                            }
                          </small>

                        </td>


                        <td>

                          {
                            formatDuration(
                              license
                            )
                          }

                        </td>


                        <td>

                          {
                            license.mentor_name ||
                            license.mentor_id ||
                            "—"
                          }

                        </td>


                        <td>

                          <span
                            className={
                              `license-status ${
                                String(
                                  license.status ||
                                  ""
                                ).toLowerCase()
                              }`
                            }
                          >
                            {
                              String(
                                license.status ||
                                "UNKNOWN"
                              ).toUpperCase()
                            }
                          </span>

                        </td>


                        <td>

                          <button
                            type="button"
                            className="copy-license"
                            onClick={() =>
                              copyKey(
                                license.license_key
                              )
                            }
                            title="Copy license"
                          >

                            <Copy
                              size={15}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>


            {filteredLicenses.length > 100 && (

              <div className="license-limit-notice">

                Showing the first 100 licenses.
                The licenses remain stored in
                the Ghost Nexus database.

              </div>

            )}

          </div>

        )}

      </section>

    </div>
  );
}