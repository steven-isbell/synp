'use strict'
const fs = require('fs')
const path = require('path')

module.exports = function validatePath (program) {
  const { sourceFile, force } = program
  const sourceFileName = sourceFile.split(path.sep).pop()
  const sourcePath = sourceFile.split(path.sep).slice(0, -1).join(path.sep)
  const destFileName = sourceFileName === 'yarn.lock' ? 'package-lock.json' : 'yarn.lock'
  const destFile = path.join(sourcePath, destFileName)
  const nodeModulesPath = path.join(sourcePath, 'node_modules')
  const nodeModulesStats = fs.existsSync(nodeModulesPath) && fs.statSync(nodeModulesPath)
  const sourceStats = fs.existsSync(sourceFile) && fs.statSync(sourceFile)
  if (!sourceStats || !sourceStats.isFile()) {
    throw new Error(`source-file ${sourceFile} does not exist`)
  }
  if (fs.existsSync(destFile) && !force) {
    throw new Error(`destination file ${destFile} already exists, will not overwrite`)
  }
  if (!nodeModulesStats || !nodeModulesStats.isDirectory()) {
    throw new Error(`node_modules directory does not exist in path ${sourcePath}`)
  }
}
