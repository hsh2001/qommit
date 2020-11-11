import { underline } from 'chalk';
import * as execa from 'execa';
import { prompt } from 'inquirer';

prompt([
  {
    name: 'flags',
    type: 'input',
    message: 'Type flags: (e.g.: -a --author=HSH)',
  },
  {
    name: 'titlePrefix',
    type: 'list',
    message: 'Select title prefix:',
    choices: [
      '🛠 [CREATE]',
      '🗑 [REMOVE]',
      '🔧 [UPDATE]',
      '🐛 [BUGFIX]',
      '🔥 [HOTFIX]',
      '✅ [RESOLVE-ISSUE]',
      '🚀 [DEPENDENCY-UPDATE]',
      '📄 [DOCUMENTATION]',
      '🧹 [CHORE]',
    ],
  },
  { name: 'title', type: 'input', message: 'Enter commit title:' },
  { name: 'description', type: 'editor', message: 'Enter commit description' },
]).then(async function ({
  flags,
  titlePrefix,
  title,
  description,
}: {
  [key: string]: string;
}) {
  const commitTitle = `${titlePrefix} ${title}`;
  const commitMessage = `${commitTitle}

${description}`;

  console.log(`
-------------------------------
${underline.bold(commitTitle)}

${description}
-------------------------------
`);

  const { confirmed } = await prompt([
    { name: 'confirmed', type: 'confirm', message: 'Is this OK?' },
  ]);

  if (confirmed) {
    const args = ['commit', flags, `-m ${commitMessage.trim()}`];

    if (flags) args.push(flags);

    execa('git', args);
  }
});
