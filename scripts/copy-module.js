const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
const targetPath = process.argv[3] || '../src/modules';

if (!moduleName) {
  console.error('Usage : npm run generate:module -- <module-name> [<target-path>]');
  process.exit(1);
}

const sourcePath = path.join(__dirname, '../src/modules/template');
const destinationPath = path.join(__dirname, targetPath, moduleName);

fs.mkdirSync(destinationPath, { recursive: true });

function copyAndReplaceTemplates(src, dest, replaceMap) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name.replace('__template__', moduleName));

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyAndReplaceTemplates(srcPath, destPath, replaceMap);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      Object.entries(replaceMap).forEach(([key, value]) => {
        content = content.replace(new RegExp(key, 'g'), value);
      });

      // Ajouter la gestion des relations pour l'entité
      if (entry.name.includes('entity.ts')) {
        content = handleEntityRelations(content, replaceMap);
      }

      fs.writeFileSync(destPath, content);
    }
  });
}

// Fonction pour ajouter les imports liés aux relations dans l'entité
function handleEntityRelations(content, replaceMap) {
  const relationRegex = /@(ManyToOne|OneToMany|ManyToMany|OneToOne)\(.*?\)\s+([a-zA-Z]+)/g;
  const matches = [...content.matchAll(relationRegex)];
  const imports = matches.map(([, , relatedEntity]) => {
    const className = relatedEntity.charAt(0).toUpperCase() + relatedEntity.slice(1);
    return `import { ${className} } from '../${relatedEntity}/${relatedEntity}.entity';`;
  });

  if (imports.length > 0) {
    const importSection = imports.join('\n');
    content = importSection + '\n' + content;
  }

  return content;
}

const replaceMap = {
  __template__: moduleName,
  template: moduleName,
  __Template__: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
  Template: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
  'templateController': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Controller`,
  'templateService': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Service`,
  'templateDtoRequestDto': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}DtoRequestDto`,
  'TemplateDtoRequestDto': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}DtoRequestDto`,
  'templateRepository': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Repository`,
  'Template.controller': `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Controller`,
};

copyAndReplaceTemplates(sourcePath, destinationPath, replaceMap);

// Ajout de l'importation du module dans app.module.ts
function addModuleToAppModule(moduleName) {
  const appModulePath = path.join(__dirname, '../src/app.module.ts');

  // Lire le fichier app.module.ts
  let content = fs.readFileSync(appModulePath, 'utf8');

  // Créer l'importation et ajouter le module dans les imports
  const importStatement = `import { ${moduleName}Module } from './modules/${moduleName}/${moduleName}.module';\n`;
  const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+['"][^'"]+['"];.*\n/;

  // Vérifier si l'importation est déjà présente, sinon l'ajouter
  if (!content.match(importRegex)) {
    content = importStatement + content;
  }

  const moduleRegex = /@Module\(([\s\S]*?)\)/;
  content = content.replace(moduleRegex, (match) => {
    return match.replace(
      /imports:\s*\[/,
      `imports: [\n    ${moduleName}Module,`
    );
  });

  // Écrire les modifications dans le fichier app.module.ts
  fs.writeFileSync(appModulePath, content, 'utf8');
}

addModuleToAppModule(moduleName);

console.log(`Module "${moduleName}" généré dans ${destinationPath} et ajouté à app.module.ts`);
