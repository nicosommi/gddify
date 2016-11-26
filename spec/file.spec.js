import File from '../source/lib/file.js'

describe('File', () => {
  let file
  beforeEach(() => {
    file = new File('afilePath.js', 'mycleanfile.js')
  })
  describe('(properties)', () => {
    it('should have a path string property', () => {
      file.path.should.equal('afilePath.js')
    })

    it('should have a stamps property', () => {
      file.stamps.should.eql('')
    })

    it('should have a replacements object property', () => {
      file.replacements.should.eql({})
    })

    it('should have a clean file path string property', () => {
      file.cleanFilePath.should.eql('mycleanfile.js')
    })
  })

  describe('(methods)', () => {
    it('should provide a stamps method that sets the property', () => {
      const stamps = 'aregexp'
      file.setStamps(stamps)
      file.stamps.should.eql(stamps)
    })

    it('should provide a stamps method that sets the property', () => {
      const replacements = { 'key': 'value' }
      file.replacing(replacements)
      file.replacements.should.eql(replacements)
    })
  })
})
