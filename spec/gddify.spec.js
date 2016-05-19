import Gddify from '../source/lib/gddify.js'
import fs from 'fs-extra'
import del from 'del'

describe('Gddify', () => {
  let gddify

  beforeEach(() => {
    gddify = new Gddify()
  })

  it('should be a class', () => {
    gddify.should.be.instanceOf(Gddify)
  })

  describe('.add', () => {
    it('should allow to add genes to growth and clean', () => {
      const options = {}
      const source = `${__dirname}/../fixtures/firstGene.js`
      const growth = `${__dirname}/../fixtures/firstGrowth.js`
      const clean = `${__dirname}/../fixtures/firstCleaned.js`
      gddify.add(
        source,
        growth,
        clean,
        options
      )

      gddify.genes.should.eql([{ source, growth, clean, options}])
    })

    it('should allow to add stable genes (keeps filename) to batch growth and clean', () => {
      const options = {}
      const firstGene = `${__dirname}/../fixtures/firstGene.js`
      const secondGene = `${__dirname}/../fixtures/secondGene.js`
      const genes = [firstGene, secondGene]
      const firstGrowth = `${__dirname}/../fixtures/firstGene.js`
      const firstCleaned = `${__dirname}/../fixtures/firstGene.js`
      const secondGrowth = `${__dirname}/../fixtures/secondGene.js`
      const secondCleaned = `${__dirname}/../fixtures/secondGene.js`

      gddify.add(
        genes,
        `${__dirname}/../fixtures`,
        `${__dirname}/../fixtures`,
        {}
      )

      gddify.genes.should.eql([
        { source: firstGene, growth: firstGrowth, clean: firstCleaned, options},
        { source: secondGene, growth: secondGrowth, clean: secondCleaned, options}
      ])
    })
  })

  describe('.generate', () => {
    describe('(when ok)', () => {
      let options,
        firstGrowthExpectation,
        secondGrowthExpectation,
        thirdGrowthExpectation,
        thirdGrowth,
        firstGrowth,
        secondGrowth

      beforeEach(done => {
        options = {
          replacements: {
            'Mango': 'Apple'
          },
          ignoringStamps: ['astamp']
        }

        gddify.add(
          `${__dirname}/../fixtures/firstGene.js`,
          `${__dirname}/../fixtures/firstGrowth.js`,
          `${__dirname}/../fixtures/firstCleaned.js`,
          options
        )

        options.replacements.Mango = 'Orange'
        delete options.ignoringStamps
        options.delimiters = {
          start: '/*',
          end: '*/'
        }

        gddify.add(
          `${__dirname}/../fixtures/secondGene.js`,
          `${__dirname}/../fixtures/secondGrowth.js`,
          `${__dirname}/../fixtures/secondCleaned.js`,
          options
        )

        delete options.replacements
        delete options.delimiters
        options.ignoringStamps = ['mangostamp']

        gddify.add(
          `${__dirname}/../fixtures/thirdGene.md`,
          `${__dirname}/../fixtures/thirdGrowth.md`,
          `${__dirname}/../fixtures/thirdCleaned.md`,
          options
        )

        gddify.generate()
          .then(() => {
            firstGrowthExpectation = fs.readFileSync(`${__dirname}/../fixtures/firstGrowthExpectation.js`, {encoding: 'utf8'})
            firstGrowth = fs.readFileSync(`${__dirname}/../fixtures/firstGrowth.js`, {encoding: 'utf8'})
            secondGrowthExpectation = fs.readFileSync(`${__dirname}/../fixtures/secondGrowthExpectation.js`, {encoding: 'utf8'})
            secondGrowth = fs.readFileSync(`${__dirname}/../fixtures/secondGrowth.js`, {encoding: 'utf8'})
            thirdGrowthExpectation = fs.readFileSync(`${__dirname}/../fixtures/thirdGrowthExpectation.md`, {encoding: 'utf8'})
            thirdGrowth = fs.readFileSync(`${__dirname}/../fixtures/thirdGrowth.md`, {encoding: 'utf8'})
            done()
          })
      })

      afterEach(() => {
        fs.writeFileSync(`${__dirname}/../fixtures/firstGrowth.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/secondGrowth.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/thirdGrowth.md`, '', {encoding: 'utf8'})
      })

      it('should allow to generate multiple genes to growth', () => {
        firstGrowth.should.equal(firstGrowthExpectation)
        secondGrowth.should.equal(secondGrowthExpectation)
        thirdGrowth.should.equal(thirdGrowthExpectation)
      })
    })

    describe('(when error)', () => {
      beforeEach(() => {
        gddify.add(
          `${__dirname}/../fixtures/unexistingGene.js`,
          `${__dirname}/../fixtures/unexistingGrowth.js`,
          `${__dirname}/../fixtures/unexistingCleaned.js`,
          {}
        )
      })

      afterEach(() => del([`${__dirname}/../fixtures/unexistingGene.js`, `${__dirname}/../fixtures/unexistingGrowth.js`, `${__dirname}/../fixtures/unexistingCleaned.js`]))

      it('should throw ENOENT if a gene does not exist', () => {
        return gddify.generate()
          .should.be.rejectedWith(/ENOENT/)
      })
    })
  })

  describe('.clean', () => {
    describe('(when ok)', () => {
      let options,
        firstCleanedExpectation,
        secondCleanedExpectation,
        thirdCleanedExpectation,
        thirdCleaned,
        firstCleaned,
        secondCleaned

      beforeEach(done => {
        options = {
          replacements: {
            'Mango': 'Apple'
          },
          ignoringStamps: ['astamp']
        }

        gddify.add(
          `${__dirname}/../fixtures/firstGene.js`,
          `${__dirname}/../fixtures/firstGrowth.js`,
          `${__dirname}/../fixtures/firstCleaned.js`,
          options
        )

        options.replacements.Mango = 'Orange'
        delete options.ignoringStamps
        options.delimiters = {
          start: '/*',
          end: '*/'
        }

        gddify.add(
          `${__dirname}/../fixtures/secondGene.js`,
          `${__dirname}/../fixtures/secondGrowth.js`,
          `${__dirname}/../fixtures/secondCleaned.js`,
          options
        )

        delete options.replacements
        delete options.delimiters
        options.ignoringStamps = ['mangostamp']

        gddify.add(
          `${__dirname}/../fixtures/thirdGene.md`,
          `${__dirname}/../fixtures/thirdGrowth.md`,
          `${__dirname}/../fixtures/thirdCleaned.md`,
          options
        )

        gddify.generate()
          .then(() => {
            gddify.clean()
              .then(() => {
                firstCleanedExpectation = fs.readFileSync(`${__dirname}/../fixtures/firstCleanedExpectation.js`, {encoding: 'utf8'})
                firstCleaned = fs.readFileSync(`${__dirname}/../fixtures/firstCleaned.js`, {encoding: 'utf8'})
                secondCleanedExpectation = fs.readFileSync(`${__dirname}/../fixtures/secondCleanedExpectation.js`, {encoding: 'utf8'})
                secondCleaned = fs.readFileSync(`${__dirname}/../fixtures/secondCleaned.js`, {encoding: 'utf8'})
                thirdCleanedExpectation = fs.readFileSync(`${__dirname}/../fixtures/thirdCleanedExpectation.md`, {encoding: 'utf8'})
                thirdCleaned = fs.readFileSync(`${__dirname}/../fixtures/thirdCleaned.md`, {encoding: 'utf8'})
                done()
              })
          })
      })

      afterEach(() => {
        fs.writeFileSync(`${__dirname}/../fixtures/firstCleaned.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/secondCleaned.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/thirdCleaned.md`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/firstGrowth.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/secondGrowth.js`, '', {encoding: 'utf8'})
        fs.writeFileSync(`${__dirname}/../fixtures/thirdGrowth.md`, '', {encoding: 'utf8'})
      })

      it('should allow to generate multiple genes to growth', () => {
        firstCleaned.should.equal(firstCleanedExpectation)
        secondCleaned.should.equal(secondCleanedExpectation)
        thirdCleaned.should.equal(thirdCleanedExpectation)
      })
    })

    describe('(when error)', () => {
      beforeEach(() => {
        gddify.add(
          `${__dirname}/../fixtures/firstGene.js`,
          `${__dirname}/../fixtures/unexistingGrowth.js`,
          `${__dirname}/../fixtures/unexistingCleaned.js`,
          {}
        )
      })

      afterEach(() => del([`${__dirname}/../fixtures/unexistingGrowth.js`, `${__dirname}/../fixtures/unexistingCleaned.js`]))

      it('should throw ENOENT if a growth does not exist (user forgot to run generate)', () => {
        return gddify.clean()
          .should.be.rejectedWith(/ENOENT/)
      })
    })
  })
})
