export function collectScriptElements(sourceCode, parsedCode): any[] {
  const output = [];
  collectScriptElementsInner(sourceCode, parsedCode, output);
  return output;
}

function collectScriptElementsInner(sourceCode, codeElement, output): void {
  expandSourceReference(sourceCode, codeElement);
  output.push(codeElement);

  const children = Array.isArray(codeElement) ? codeElement : (codeElement.args || []);

  for (const arg of children) {
    collectScriptElementsInner(sourceCode, arg, output);
  }
}

function expandSourceReference(sourceCode, codeElement): void {
  const ref = codeElement[Object.getOwnPropertySymbols(codeElement)[0]];

  if (!ref) {
    return;
  }

  let line = 1;
  let lineStart = 0;

  for (let position = 0; position < ref.first; ++position) {
    if (sourceCode[position] === '\n') {
      lineStart = position + 1;
      line++;
    }
  }

  ref.start = {
    line,
    column: ref.first - lineStart + 1,
    point: ref.first,
  };

  // NOTE: when there are array parameters, if the last instruction doesn't end with ";", we need to adjust
  // the last position so that it includes the closing '}'.
  if ((Array.isArray(codeElement) || Array.isArray(codeElement.args)) && sourceCode[ref.last] !== ';') {
    let position = ref.last;
    while (typeof sourceCode[position] !== 'undefined' && sourceCode[position] !== '}') {
      ++position;
    }
    ref.last = position + 1;
  }

  for (let position = ref.first; position < ref.last; ++position) {
    if (sourceCode[position] === '\n') {
      lineStart = position + 1;
      line++;
    }
  }

  ref.end = {
    line,
    column: ref.last - lineStart + 1,
    point: ref.last,
  };
}
