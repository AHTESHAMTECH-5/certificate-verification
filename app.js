let scanner = null;

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  $("#verifyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    verifyCertificate($("#certificateId").value);
  });

  $("#startScanner").addEventListener("click", startScanner);
  $("#stopScanner").addEventListener("click", stopScanner);

  const idFromUrl = new URLSearchParams(window.location.search).get("id");
  if (idFromUrl) {
    switchTab("id");
    $("#certificateId").value = idFromUrl;
    verifyCertificate(idFromUrl);
  }
});

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  $("#id-panel").classList.toggle("active", tab === "id");
  $("#qr-panel").classList.toggle("active", tab === "qr");
  if (tab !== "qr") stopScanner();
}

function normalizeId(id) {
  return String(id || "").trim().toUpperCase();
}

function verifyCertificate(rawId) {
  const id = normalizeId(rawId);
  if (!id) {
    showInvalid("Please enter a Certificate ID.");
    return;
  }

  const cert = CERTIFICATES[id];
  if (!cert) {
    showInvalid(`No certificate was found for ID <strong>${escapeHtml(id)}</strong>. Please check the ID and try again.`);
    return;
  }

  showCertificate(cert);
}

function showCertificate(cert) {
  $("#resultSection").innerHTML = `
    <article class="result verified">
      <div class="status">
        <div class="status-icon">✓</div>
        <div>
          <h3>Certificate Verified</h3>
          <p>This certificate ID exists in the Ahtesham Tech verification database.</p>
        </div>
      </div>

      <div class="cert-grid">
        <div class="cert-item"><small>Certificate ID</small><strong>${escapeHtml(cert.id)}</strong></div>
        <div class="cert-item"><small>Status</small><strong>${escapeHtml(cert.status)}</strong></div>
        <div class="cert-item"><small>Presented To</small><strong>${escapeHtml(cert.name)}</strong></div>
        <div class="cert-item"><small>Issued On</small><strong>${escapeHtml(cert.issuedOn)}</strong></div>
        <div class="cert-item"><small>Programme</small><strong>${escapeHtml(cert.programme)}</strong></div>
        <div class="cert-item"><small>Programme Context</small><strong>${escapeHtml(cert.programmeContext)}</strong></div>
        <div class="cert-item"><small>Issued By</small><strong>${escapeHtml(cert.issuedBy)}</strong></div>
        <div class="cert-item"><small>Issuer Role</small><strong>${escapeHtml(cert.issuerRole)}</strong></div>
      </div>

      <div class="cert-message">
        ${escapeHtml(cert.description)}
        <br><br>${escapeHtml(cert.note)}
      </div>

      ${cert.certificateUrl ? `<p style="margin:18px 0 0"><a class="primary-btn" style="display:inline-block;text-decoration:none" href="${escapeAttr(cert.certificateUrl)}" target="_blank" rel="noopener">View Certificate</a></p>` : ""}
    </article>
  `;
  $("#resultSection").scrollIntoView({behavior:"smooth", block:"center"});
}

function showInvalid(message) {
  $("#resultSection").innerHTML = `
    <article class="result invalid">
      <div class="status">
        <div class="status-icon">!</div>
        <div>
          <h3>Certificate Not Found</h3>
          <p>The supplied certificate ID could not be verified.</p>
        </div>
      </div>
      <div class="cert-message">${message}<br><br>Please verify that you entered the complete ID printed on the certificate.</div>
    </article>
  `;
  $("#resultSection").scrollIntoView({behavior:"smooth", block:"center"});
}

async function startScanner() {
  if (typeof Html5Qrcode === "undefined") {
    alert("QR scanner library is still loading. Please try again in a moment.");
    return;
  }

  if (scanner) return;

  scanner = new Html5Qrcode("reader");
  $("#startScanner").classList.add("hidden");
  $("#stopScanner").classList.remove("hidden");

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      decodedText => {
        handleQr(decodedText);
        stopScanner();
      },
      () => {}
    );
  } catch (err) {
    scanner = null;
    $("#startScanner").classList.remove("hidden");
    $("#stopScanner").classList.add("hidden");
    alert("Could not start the camera. Check browser camera permission and try again.");
  }
}

async function stopScanner() {
  if (!scanner) return;
  try { await scanner.stop(); } catch(e) {}
  try { scanner.clear(); } catch(e) {}
  scanner = null;
  $("#startScanner").classList.remove("hidden");
  $("#stopScanner").classList.add("hidden");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
