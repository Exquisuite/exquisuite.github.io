const taskInput = $('taskInput');
let taskRevision = 0;

function assignmentItems(input) {
  const segmenter = new Intl.Segmenter('hu', { granularity: 'sentence' });
  return input.split(/\r?\n/).map(line=>line.trim().replace(/^\d+[.)]\s+/, '')).flatMap(line =>
    Array.from(segmenter.segment(line), part => part.segment.trim()).filter(Boolean)
  );
}

taskInput.oninput = () => {
  taskRevision++;
  $('taskRun').disabled = false;
  $('taskResult').hidden = true;
  $('taskStatus').textContent = '';
};

$('taskRun').onclick = async () => {
  const items = reportInputs(taskInput.value);
  if (!items.length) {
    $('taskStatus').textContent = '정리할 헝가리어 원문을 입력해 주세요.';
    taskInput.focus();
    return;
  }
  const revision = ++taskRevision;
  $('taskRun').disabled = true;
  $('taskResult').hidden = true;
  const sections = [], frames = [];
  for (const [i, source] of items.entries()) {
    $('taskStatus').textContent = (i + 1) + ' / ' + items.length + ' 항목 분석 중…';
    try {
      const section = await reportItem(source, i + 1);
      sections.push(section.text);
      frames.push(...section.frames);
    } catch {
      sections.push((i + 1) + '. ' + source + '\n분석 미완료 · 원문을 확인하고 다시 시도해 주세요.');
    }
    if (revision !== taskRevision) return;
  }
  $('taskText').value = assembleReport(sections,frames);
  $('taskResult').hidden = false;
  $('taskRun').disabled = false;
  $('taskStatus').textContent = items.length + '개 항목을 정리했습니다. 제출 전에 내용을 검토하고 수정할 수 있습니다.';
};

$('taskCopy').onclick = async () => {
  const output = $('taskText');
  try {
    await navigator.clipboard.writeText(output.value);
    $('taskStatus').textContent = '제출용 텍스트 전체를 복사했습니다.';
  } catch {
    output.focus();
    output.select();
    $('taskStatus').textContent = '전체 텍스트를 선택했습니다. 복사 단축키를 눌러 주세요.';
  }
};

$('referenceLoad').onclick=()=>{
  const titles=referenceGroups.map(g=>g.title).join('\n');
  if(taskInput.value.trim() && taskInput.value.trim()!==titles && !confirm('작성 중인 원문을 최종본 14개 항목으로 바꿀까요?'))return;
  taskInput.value=titles;
  taskInput.oninput();
  taskInput.focus();
};
