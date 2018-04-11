/**
 * An asynchronous for-each loop
 *
 * @param   {array}     array       The array to loop through
 *
 * @param   {function}  done        Callback function (when the loop is finished or an error occurs)
 *
 * @param   {function}  iterator
 * The logic for each iteration.  Signature is `function(item, index, next)`.
 * Call `next()` to continue to the next item.  Call `next(Error)` to throw an error and cancel the loop.
 * Or don't call `next` at all to break out of the loop.
 */
function asyncForEach(array, done, iterator) {
    var i = 0;
    next();

    function next(err) {
        if (err) {
            done(err);
        }
        else if (i >= array.length) {
            done();
        }
        else if (i < array.length) {
            var item = array[i++];
            setTimeout(function() {
                iterator(item, i - 1, next);
            }, 0);
        }
    }
}
