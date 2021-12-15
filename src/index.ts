import * as fs from 'fs'
import * as path from 'path'

const npmCheck = require('npm-check')

const reREADME = async (
  outputPath: string,
): Promise<void> => {
  console.log('Generating latest README...')
  const checkInfo = await npmCheck()
  const packages = await checkInfo.get('packages')
  console.log('packages', packages)
  const packageBadges = packages.reduce((badges: {
    dep: Array<string>,
    dev: Array<string>
  }, { 
    moduleName,
    latest: latestVersion,
    packageJson: declaredVersion,
    homepage,
    bump,
    devDependency,
  }: {
    moduleName: string
    latest: string
    packageJson: string
    homepage: string
    bump: string | null
    devDependency: boolean
  }) => {
    let color = 'lightgrey'
    if(bump === null) {
      color = 'green'
    } else if (bump === 'patch') {
      color = 'yellow'
    } else if (bump === 'minor') {
      color = 'orange'
    } else if (bump === 'major') {
      color = 'red'
    }

    const badge = `[![](https://img.shields.io/static/v1?label=${
      moduleName
    }&message=${
      declaredVersion}%20→%20${latestVersion
    }&color=${color})](${homepage})`

    if (devDependency) {
      return {
        ...badges,
        dev: [
          ...badges.dev,
          badge,
        ]
      }
    } else {
      return {
        ...badges,
        dep: [
          ...badges.dep,
          badge,
        ]
      }
    }
  }, {
    dev: [],
    dep: [],
  })
  
  console.log(packageBadges)

  const contents = `# rereadme
an exploration on creating a readme file generator

## Package Status
### dependencies
${packageBadges.dep.reduce((badgesToText: string, badge: string) => {
  return badgesToText += badge
}, '')}
### devDependencies
${packageBadges.dev.reduce((badgesToText: string, badge: string) => {
  return badgesToText += badge
}, '')}`

  fs.writeFile(outputPath, contents, (err) => {
    if (err) {
      return console.log(err)
    }
  })
  console.log('Done.')
}

export default reREADME
