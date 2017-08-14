import assert from 'assert';
import {sendmail} from '../../lib/EmailUtil';

describe('SendMail', function() {
  describe('normal mail send', function () {
    it('should no error after SendMail', function (done) {
      this.timeout(15000);
      sendmail("careu@104.com.tw" , "microbean@gmail.com" , "test" , "body" , (err,data) => { assert.ifError(err); done();} );
    });

    it('with empty from should send default email & no error after SendMail', function (done) {
      this.timeout(15000);
      sendmail("" , "microbean@gmail.com" , "test" , "body" , (err,data) => { assert.ifError(err); done();} );
    });

    it('with empty TO should error after SendMail', function (done) {
      this.timeout(15000);
      sendmail("careu@104.com.tw" , "" , "test" , "body" , (err,data) => { assert(err != undefined); done();} );
    });
  });
});