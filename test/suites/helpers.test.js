;(function(undefined) {

  /**
   * artoo helpers unit tests
   * =========================
   *
   */
  describe('artoo.helpers', function() {

    describe('first', function() {

      it('should return the correct item in the array.', function() {
        assert.strictEqual(
          artoo.helpers.first([1, 2, 3], function(e) {
            return e === 2;
          }),
          2
        );
      });

      it('should return undefined if the item were not to be found.', function() {
        assert.strictEqual(
          artoo.helpers.first([1, 2, 3], function(e) {
            return e === 4;
          }),
          undefined
        );
      });
    });

    describe('indexOf', function() {
      var a = [
        {name: 'John'},
        {name: 'Patrick'}
      ];

      it('should return the correct index if the item exists.', function() {
        assert.strictEqual(
          artoo.helpers.indexOf(a, function(i) {
            return i.name === 'Patrick';
          }),
          1
        );
      });

      it('should return -1 if the item were not to be found.', function() {
        assert.strictEqual(
          artoo.helpers.indexOf(a, function(i) {
            return i.name === 'Jack';
          }),
          -1
        );
      });
    });

    describe('before', function() {
      it('should run the given function before the original one.', function() {
        var count = 0;

        var targetFunction = function() {
          count++;
          return 'ok';
        };

        // Monkey patching
        var newFunction = artoo.helpers.before(targetFunction, function() {
          count++;
        });

        assert.strictEqual(newFunction(), 'ok');
        assert.strictEqual(count, 2);
      });
    });

    describe('toCSVString', function() {
      var arrays = {
        correct: [['Michel', 'Chenu'], ['Marion', 'La brousse']],
        delimiter: [['Michel', 'Chenu, the Lord'], ['Marion', 'La brousse']],
        escape: [['Michel', 'Chenu'], ['Marion', 'dit "La brousse"']],
        badass: [['Michel', 'Chenu, the Lord'], ['Marion', 'dit "La brousse"']],
        linebreak: [
          { a: 'toto', b: 'tata\n', c: 'titi' },
          { a: 'tutu', b: 'pouet',  c: 'blah' }
        ]
      };

      var strings = {
        correct: 'Michel,Chenu\nMarion,La brousse',
        delimiter: 'Michel,"Chenu, the Lord"\nMarion,La brousse',
        escape: 'Michel,Chenu\nMarion,"dit ""La brousse"""',
        badass: 'Michel,"Chenu, the Lord"\nMarion,"dit ""La brousse"""',
        tsv: 'Michel\tChenu\nMarion\tLa brousse',
        customEscape: 'Michel,|Chenu, the Lord|\nMarion,La brousse',
        linebreak: 'a,b,c\ntoto,"tata\n",titi\ntutu,pouet,blah'
      };

      var headerArray = [
        {
          firstName: 'Michel',
          lastName: 'Chenu'
        },
        {
          firstName: 'Marion',
          lastName: 'La brousse'
        }
      ];

      var headerString = 'firstName,lastName\nMichel,Chenu\nMarion,La brousse',
          customString = 'one,two\nMichel,Chenu\nMarion,La brousse';

      it('should be able to handle simple cases.', function() {
        for (var i in arrays) {
          assert.strictEqual(
            artoo.helpers.toCSVString(arrays[i]),
            strings[i]
          );
        }
      });

      it('should be able to handle custom delimiters.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString(arrays.correct, {delimiter: '\t'}),
          strings.tsv
        );
      });

      it('should be able to handle custom escape characters.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString(arrays.delimiter, {escape: '|'}),
          strings.customEscape
        );
      });

      it('should be able to output a string with correct headers.', function() {

        // Basic
        assert.strictEqual(
          artoo.helpers.toCSVString(headerArray),
          headerString
        );

        // We don't want headers
        assert.strictEqual(
          artoo.helpers.toCSVString(headerArray, {headers: false}),
          strings.correct
        );

        // Custom headers applied on array
        assert.strictEqual(
          artoo.helpers.toCSVString(arrays.correct, {headers: ['one', 'two']}),
          customString
        );

        // Custom headers applied on array of objects
        assert.strictEqual(
          artoo.helpers.toCSVString(headerArray, {headers: ['one', 'two']}),
          customString
        );
      });

      it('should be able to output a CSV from other things than strings.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString([[1, 2], [3, 4]]),
          '1,2\n3,4'
        );
      });

      it('should be able to output a full CSV from array of items with different keys.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ]),
          'key1,key2,key3\nok,ok,\nko,,ko'
        );
      });

      it('should be able to output a CSV with a specified order.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ], {order: ['key2', 'key1']}),
          'key2,key1\nok,ok\n,ko'
        );
      });

      it('should be possible to combine an order and headers to output a CSV.', function() {
        assert.strictEqual(
          artoo.helpers.toCSVString([
            {
              key1: 'ok',
              key2: 'ok'
            },
            {
              key1: 'ko',
              key3: 'ko'
            }
          ], {order: ['key1', 'key2'], headers: ['Keyone', 'Keytwo']}),
          'Keyone,Keytwo\nok,ok\nko,'
        );
      });
    });
  });
}).call(this);
