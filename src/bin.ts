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
      ':wrench: [CREATE]',
      ':wastebasket: [REMOVE]',
      ':wrench: [UPDATE]',
      ':bug: [BIGFIX]',
      ':fire: [HOTFIX]',
      ':white_check_mark: [RESOLVE-ISSUE]',
      ':arrow_up: [DEPENDENCY-UPDATE]',
      ':page_facing_up: [DOCUMENTATION]',
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
    const escapedCommitMessage = commitMessage
      .trim()
      .replace(/\n/g, '\\n')
      .replace(/\"/g, '\\"');
    execa(`git commit ${flags} -m "${escapedCommitMessage}"`);
  }
});
