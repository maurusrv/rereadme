import * as fs from 'fs'
import { Badges, Contents, Package } from './types'

const npmCheck = require('npm-check')

const generateBadges = (packages: Array<Package>): Badges => {
  return packages.reduce((badges: {
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
}

const reREADME = async ({
  outputPath,
  contents,
  badges,
}: {
  outputPath: string,
  contents?: Contents,
  badges?: boolean
}): Promise<void> => {
  console.log('Generating latest README...')
  const checkInfo = await npmCheck()
  const packages = await checkInfo.get('packages')

  if (badges) console.log('Generating badges...')
  const packageBadges = badges ? generateBadges(packages) : null
  
  let markdownContents = ''

  markdownContents = `${contents?.header ?? ''}
${contents?.main ?? ''}`

  if (packageBadges) {
    markdownContents += `## Package Status
### \`dependencies\`
${packageBadges.dep.reduce((badgesToText: string, badge: string) => {
  return badgesToText += badge
}, '')}
### \`devDependencies\`
${packageBadges.dev.reduce((badgesToText: string, badge: string) => {
  return badgesToText += badge
}, '')}
`
  }

  markdownContents += `
#
${contents?.footer ?? ''}`

  fs.writeFile(outputPath, markdownContents, (err) => {
    if (err) {
      return console.log(err)
    }
  })
  console.log('Done.')
}

export default reREADME
