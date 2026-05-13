// Encontra e substitui a função Escala por uma versão corrigida
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Função Escala CORRIGIDA
const novaEscala = `function Escala(){
  const [dados, setDados] = useState([]);
  useEffect(() => {
    fetch(\`\${SUPABASE_URL}/rest/v1/escala_rascunho\`, {
      headers: { 'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\` }
    })
    .then(r => r.json())
    .then(d => setDados(d || []))
    .catch(e => setDados([]));
  }, []);
  
  return h('div', {className: 'pg'},
    h('h1', null, '📅 Escala'),
    h('p', null, \`\${dados.length} registros\`),
    h('table', {style: {width: '100%', borderCollapse: 'collapse'}},
      h('thead', null,
        h('tr', null,
          h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Data'),
          h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Placa'),
          h('th', {style: {border: '1px solid #ccc', padding: '8px'}}, 'Motorista')
        )
      ),
      h('tbody', null,
        dados.map((r, idx) =>
          h('tr', {key: idx},
            h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.data || '—'),
            h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.placa || '—'),
            h('td', {style: {border: '1px solid #ccc', padding: '8px'}}, r.motorista || '—')
          )
        )
      )
    )
  );
}`;

// Minificar
const minified = novaEscala
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*/g, '')
  .replace(/\s+/g, ' ')
  .trim();

console.log(minified);
