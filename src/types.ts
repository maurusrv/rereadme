export type Package = {
  moduleName: string,
  homepage: string,
  regError: undefined,
  pkgError: undefined,
  latest: string,
  installed: string,
  isInstalled: boolean,
  notInstalled: boolean,
  packageWanted: string,
  packageJson: string,
  notInPackageJson: undefined,
  devDependency: boolean,
  usedInScripts: undefined,
  mismatch: boolean,
  semverValid: string,
  easyUpgrade: boolean,
  bump: string | null,
  unused: boolean
}

export type Badge = {
  order: number,
  label: string
}

export type Badges = {
  dep: Array<Badge>
  dev: Array<Badge>
}

export type Contents = {
  header?: string
  main?: string
  footer?: string
}