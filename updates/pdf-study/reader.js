'use strict';let catalog,selected,zoom=100;const $=id=>document.getElementById(id);const fold=s=>s.replace(/Ⱥ/g,'').replace(/ȴ/g,'').replace(/ȳ/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();const element=(tag,text)=>{let e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const sourceBase = new URL('.', document.currentScript.src);
const sourceVersion = new URL(document.currentScript.src).search;
const sourceUrl = path => new URL(path, sourceBase).href;
const openBranches = new Set(['week-1']);
function branch(parent, label, key, active, searching) {
  const details = element('details');
  details.open = searching || active || openBranches.has(key);
  details.append(element('summary', label));
  details.addEventListener('toggle', () => {
    if (searching || !details.isConnected) return;
    if (details.open) openBranches.add(key);
    else openBranches.delete(key);
  });
  parent.append(details);
  return details;
}
function renderNav() {
  const query = fold($('search').value.trim());
  const toc = $('toc');
  const weeks = new Map();
  let count = 0;
  for (const item of catalog.lessons) {
    const clip = /Ngày\s*(\d+).*?Clip\s*([\d.]+)/i.exec(item.clip);
    const day = clip ? 'Ngày ' + clip[1] : ['Lớp online', item.date].filter(Boolean).join(' · ');
    const label = clip ? 'Clip ' + clip[2] : 'Buổi học trực tuyến';
    const hits = query ? catalog.pages.filter(page =>
      page.week === item.week && page.page >= item.start && page.page <= item.end &&
      (fold(page.text).includes(query) || fold(page.text).replace(/\s/g, '').includes(query.replace(/\s/g, '')))
    ) : [];
    if (query && !hits.length && !fold(item.searchText || '').includes(query) && !fold([item.date, item.title, item.teacher, day, label, 'Tuần ' + item.week].join(' ')).includes(query)) continue;
    if (!weeks.has(item.week)) weeks.set(item.week, new Map());
    const days = weeks.get(item.week);
    if (!days.has(day)) days.set(day, []);
    days.get(day).push({item, label, hits});
    count++;
  }
  toc.replaceChildren();
  for (const [week, days] of weeks) {
    const weekNode = branch(toc, 'Tuần ' + week, 'week-' + week, selected?.week === week, !!query);
    for (const [day, entries] of days) {
      const dayNode = branch(weekNode, day, week + ':' + day, entries.some(({item}) => item.id === selected?.id), !!query);
      for (const {item, label, hits} of entries) {
        const a = element('a', item.title);
        a.href = '#' + item.id;
        if (selected?.id === item.id) {
          a.className = 'active';
          a.setAttribute('aria-current', 'page');
        }
        a.prepend(element('small', [label, item.date].filter(Boolean).join(' · ')));
        dayNode.append(a);
        for (const page of hits) {
          const hit = element('a', '↳ Trang ' + page.page);
          hit.href = '#' + item.id + ':p' + page.page;
          dayNode.append(hit);
        }
      }
    }
  }
  $('count').textContent = count + ' bài / clip' + (query ? ' phù hợp' : '');
}
function updateNeighbors(l) { const ix=catalog.lessons.indexOf(l);for(const [btn,delta,label] of [['prev',-1,'←'],['next',1,'→']]){const other=catalog.lessons[ix+delta];$(btn).hidden=!other;if(other){$(btn).href=`#${other.id}`;$(btn).textContent=`${label} ${other.title}`}} }
function openLesson(){if(!catalog)return;const [id,target]=location.hash.slice(1).split(':');const l=catalog.lessons.find(x=>x.id===id);$('welcome').hidden=!!l;$('lesson').hidden=!l;if(!l){selected=null;renderNav();return}selected=l;$('copy').textContent='Sao chép văn bản bài';$('status').textContent='';zoom=100;$('zoomLevel').textContent='100%';$('meta').textContent=['Tuần '+l.week,l.date].filter(Boolean).join(' · ');$('title').textContent=l.title;$('clip').textContent=l.clip;$('teacher').hidden=!l.teacher;$('teacher').textContent=l.teacher?'Giáo viên: '+l.teacher:'';$('lesson').classList.toggle('text-version', Boolean(l.article));
if (l.article) {
  $('pages').innerHTML = l.article;
  for (const image of $('pages').querySelectorAll('img[src]')) {
    const path = image.getAttribute('src');
    if (path.startsWith('/pdf-study/')) image.src = sourceUrl(path.slice('/pdf-study/'.length));
  }
  $('sections').replaceChildren();
  for (const heading of $('pages').querySelectorAll('h2,h3,h4')) {
    const link = element('a', heading.textContent);
    link.href = '#' + l.id + ':' + heading.id;
    $('sections').append(link);
  }
  updateNeighbors(l);
  renderNav();
  if (target && /^muc-\d+$/.test(target)) document.getElementById(target)?.scrollIntoView();
  else window.scrollTo(0,0);
  if (matchMedia('(max-width:650px)').matches) $('navigation').open=false;
  return;
}
const src=catalog.sources.find(s=>s.week===l.week);$('pdf').href=`${sourceUrl(src.url)}#page=${l.start}`;document.getElementById('web-version').hidden = l.id !== 'w1-p32';$('pages').replaceChildren();$('sections').replaceChildren();for(const p of catalog.pages.filter(p=>p.week===l.week&&p.page>=l.start&&p.page<=l.end)){const fig=element('figure');fig.className='page';fig.id=`page-${p.page}`;const caption=element('figcaption',`Tuần ${l.week} · Trang PDF ${p.page}`);const link=element('a','Mở trang nguồn ↗');link.href=`${sourceUrl(src.url)}#page=${p.page}`;link.target='_blank';caption.append(link);fig.append(caption);const v=element('div');v.className='viewport';const img=element('img');img.src=sourceUrl(p.image);img.alt=`Nguyên trang ${p.page} — ${src.name}`;img.loading=p.page===l.start?'eager':'lazy';img.width=2160;img.height=1215;v.append(img);fig.append(v);const det=element('details');det.append(element('summary','Văn bản trích xuất · cần đối chiếu PDF'));det.append(element('pre',p.text));fig.append(det);$('pages').append(fig);for(const h of p.headings){const a=element('a',h.text);a.href=`#${l.id}:p${p.page}-y${h.y}`;$('sections').append(a)}}updateNeighbors(l);renderNav();if(target)requestAnimationFrame(()=>(()=>{const [pn,y]=target.slice(1).split('-y');const fig=document.getElementById('page-'+pn);fig?.scrollIntoView({block:'start'});if(y&&fig)window.scrollBy(0,fig.querySelector('img').getBoundingClientRect().height*Number(y)/100)})());else window.scrollTo({top:0});if(matchMedia('(max-width:650px)').matches)$('navigation').open=false}
$('search').addEventListener('input',renderNav);window.addEventListener('hashchange',openLesson);for(const [id,delta]of [['zoomIn',25],['zoomOut',-25]])$(id).onclick=()=>{zoom=Math.max(100,Math.min(400,zoom+delta));$('zoomLevel').textContent=zoom+'%';document.querySelectorAll('.viewport img').forEach(img=>img.style.width=zoom+'%')};$('copy').onclick=async()=>{if(!selected)return;const text=selected.article ? $('pages').innerText : catalog.pages.filter(p=>p.week===selected.week&&p.page>=selected.start&&p.page<=selected.end).map(p=>p.text).join('\n\n');try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}else{const field=element('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw Error('copy blocked')}$('status').textContent=selected.article ? 'Đã sao chép nội dung bài.' : 'Đã sao chép văn bản trích xuất. Đối chiếu PDF trước khi sử dụng.';$('copy').textContent='Đã sao chép ✓'}catch(e){$('status').textContent='Trình duyệt chưa cho phép sao chép. Mở phần văn bản trích xuất dưới từng trang để chọn và sao chép.'}};
fetch(sourceUrl('catalog.json') + sourceVersion).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{catalog=d;$('lessonCount').textContent=d.lessons.length;$('sourceCount').textContent=d.sources.length;$('pageCount').textContent=d.pages.length;for(const s of d.sources){const a=element('a',s.name);a.className='source';a.href=sourceUrl(s.url);a.target='_blank';a.append(element('small',`${s.pages} trang · Tuần ${s.week}`));$('sources').append(a)}$('navigation').open=!matchMedia('(max-width:650px)').matches;openLesson()}).catch(()=>$('status').textContent='Không tải được tài liệu. Vui lòng tải lại trang.');
