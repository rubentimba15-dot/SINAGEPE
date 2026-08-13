/* ============================================================
   SINAGEPE — Controlo de acesso "need to know basis"
   Cada parceiro só vê os ecrãs que precisa para a sua função.
   Aplicado em TODOS os 55 ecrãs excepto o próprio index.html
   (que é sempre acessível, por ser o ecrã de login/logout).
   ============================================================ */
(function () {
  var pagina = location.pathname.split('/').pop() || 'index.html';
  if (pagina === '' || pagina === 'index.html') return; // login/logout sempre acessível

  var guardado = sessionStorage.getItem('sinagepe_nivel');
  if (!guardado) { location.href = 'index.html'; return; }

  var loginTime = parseInt(sessionStorage.getItem('sinagepe_login_time') || '0', 10);
  var LIMITE_MS = 30 * 60 * 1000; // 30 minutos de inactividade
  if (loginTime && (Date.now() - loginTime) > LIMITE_MS) {
    document.documentElement.style.visibility = 'hidden';
    location.href = 'sessao-expirada.html?desde=' + loginTime;
    return;
  }
  sessionStorage.setItem('sinagepe_login_time', Date.now().toString()); // renova a cada navegação (actividade)

  var nivel;
  try { nivel = JSON.parse(guardado); } catch (e) { location.href = 'index.html'; return; }

  var paginas = nivel.paginas || [];
  if (paginas.indexOf(pagina) === -1) {
    document.documentElement.style.visibility = 'hidden';
    location.href = 'acesso-negado.html?negado=' + encodeURIComponent(pagina);
  }
})();
