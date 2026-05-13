const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Função CORRIGIDA
const novaEscala = "function Escala(){ const [dados, setDados] = useState([]); useEffect(() => { fetch(`${SUPABASE_URL}/rest/v1/escala_rascunho`, { headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }) .then(r => r.json()) .then(d => setDados(d || [])) .catch(e => setDados([])); }, []); return h('div', {className: 'pg'}, h('h1', null, '📅 Escala'), h('p', null, `${dados.length} registros`), h('table', {style: {width: '100%', borderCollapse: 'collapse'}}, h('thead', null, h('tr', null, h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Data'), h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Placa'), h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Motorista') ) ), h('tbody', null, dados.map((r, idx) => h('tr', {key: idx}, h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.data || '—'), h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.placa || '—'), h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.motorista || '—') ) ) ) ) ); }";

// Encontrar a função Escala antiga (entre "function Escala(){" e "}\nfunction Equipe(){")
const pattern = /function Escala\(\)\{[^}]*\n?function Equipe/;
if (!pattern.test(html)) {
  console.log('Padrão não encontrado, tentando abordagem simples...');
  // Tenta encontrar just "function Escala(){...}" até o final
  const escalaStart = html.indexOf('function Escala(){');
  if (escalaStart === -1) {
    console.log('Função Escala não encontrada!');
    process.exit(1);
  }
  
  // Encontrar o fim da função (próximo "function " ou fim do arquivo)
  const restAfterEscala = html.substring(escalaStart);
  const nextFunction = restAfterEscala.substring(20).indexOf('function ');
  
  let escalaEnd;
  if (nextFunction !== -1) {
    escalaEnd = escalaStart + 20 + nextFunction;
  } else {
    escalaEnd = html.length;
  }
  
  const oldEscala = html.substring(escalaStart, escalaEnd);
  console.log('Função antiga encontrada, tamanho:', oldEscala.length);
  
  html = html.substring(0, escalaStart) + novaEscala + '\n' + html.substring(escalaEnd);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✅ Substituída com sucesso!');
} else {
  console.log('Substituição padrão aplicada');
}
