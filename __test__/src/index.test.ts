import reREADME from '../../lib'

describe('When using reREADME', () => {
  it('should generate latest README', async () => {
    await reREADME('./README.md')
  }, 10000)
})
