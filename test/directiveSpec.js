describe('Directive', function() {
  /**
   * directive works in such a way that it check actual view value, and if it is wrong (not pass pattern test), then it is rollback to
   * correct model value. Then if during test we at begin have value '' and pass wrong value '123abc' then directive rollback to previous
   * value - ''. During tests we have to change view char by char and compare each time value.
   * we need to use methods:
   * scope.testForm.testInput.$setViewValue('value') to set input
   * we need to use properties:
   * scope.testInput model value
   * scope.testForm.testInput.$viewValue view value
   */
  var compile, scope;
  beforeEach(function(){
    module('dynamicNumber');
  });
  beforeEach(inject(function ($compile, $rootScope) {
    inject(function($compile, $rootScope){
      compile = $compile;
      scope = $rootScope.$new();
      scope.testInput = "";
    });
  }));
  describe('number format: 2 integeres, decimals dot separator, positive and negative', function() {
    beforeEach(function(){
      var el = compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="." num-fract="2"/></form>')(scope);
      scope.$digest();
    });
    it('should have view value 11.11 and model value 11.11 when set 11.11', function () {
      scope.testForm.testInput.$setViewValue('11.11');
      expect(scope.testInput).toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('11.11');
    });
    it('should not have view value 111.11 and model value 111.11 when set 111.11', function () {
      scope.testForm.testInput.$setViewValue('111.11');
      expect(scope.testInput).not.toEqual('111.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('111.11');
    });
    it('should not have view value 11.111 and model value 11.111 when set 11.111', function () {
      scope.testForm.testInput.$setViewValue('111.11');
      expect(scope.testInput).not.toEqual('111.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('111.11');
    });
    it('should have view value 0.11 and model value 0.11 when set 0.11', function () {
      scope.testForm.testInput.$setViewValue('0.11');
      expect(scope.testInput).toEqual('0.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('0.11');
    });
    it('should not have view value 00.11 and model value 00.11 when set 00.11', function () {
      scope.testForm.testInput.$setViewValue('00.11');
      expect(scope.testInput).not.toEqual('00.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('00.11');
    });
    it('should have view value -11.11 and model value -11.11 when set -11.11', function () {
      scope.testForm.testInput.$setViewValue('-11.11');
      expect(scope.testInput).toEqual('-11.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-11.11');
    });
    it('should not have view value -111.11 and model value -111.11 when set -111.11', function () {
      scope.testForm.testInput.$setViewValue('-111.11');
      expect(scope.testInput).not.toEqual('-111.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('-111.11');
    });
    it('should not have view value -11.111 and model value -11.111 when set -11.111', function () {
      scope.testForm.testInput.$setViewValue('-111.11');
      expect(scope.testInput).not.toEqual('-111.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('-111.11');
    });
    it('should have view value -0.11 and model value -0.11 when set -0.11', function () {
      scope.testForm.testInput.$setViewValue('-0.11');
      expect(scope.testInput).toEqual('-0.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-0.11');
    });
    it('should not have view value -00.11 and model value -00.11 when set -00.11', function () {
      scope.testForm.testInput.$setViewValue('-00.11');
      expect(scope.testInput).not.toEqual('-00.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('-00.11');
    });
    it('should not have view value 11,11 and model value 11.11 when set 11,11', function () {
      scope.testForm.testInput.$setViewValue('11,11');
      expect(scope.testInput).not.toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('11,11');
    });
  });
  describe('number format: 2 integeres, decimals comma separator, positive and negative', function() {
    beforeEach(function(){
      var el = compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="," num-fract="2"/></form>')(scope);
      scope.$digest();
    });
    it('should have view value 11,11 and model value 11.11 when set 11,11', function () {
      scope.testForm.testInput.$setViewValue('11,11');
      expect(scope.testInput).toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('11,11');
    });
    it('should have view value 0,11 and model value 0.11 when set 0,11', function () {
      scope.testForm.testInput.$setViewValue('0,11');
      expect(scope.testInput).toEqual('0.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('0,11');
    });
    it('should have view value -11,11 and model value -11.11 when set -11,11', function () {
      scope.testForm.testInput.$setViewValue('-11,11');
      expect(scope.testInput).toEqual('-11.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-11,11');
    });
    it('should have view value -0,11 and model value -0.11 when set -0,11', function () {
      scope.testForm.testInput.$setViewValue('-0,11');
      expect(scope.testInput).toEqual('-0.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-0,11');
    });
    it('should not have view value 11.11 and model value 11.11 when set 11.11', function () {
      scope.testForm.testInput.$setViewValue('11.11');
      expect(scope.testInput).not.toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('11.11');
    });
  });
  describe('number format: 2 integeres, decimals comma separator, negative', function() {
    beforeEach(function(){
      var el = compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="," num-fract="2" num-pos="false"/></form>')(scope);
      scope.$digest();
    });
    it('should have view value 11,11 and model value 11.11 when set 11,11', function () {
      scope.testForm.testInput.$setViewValue('11,11');
      expect(scope.testInput).not.toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('11,11');
    });
    it('should have view value -11,11 and model value -11.11 when set -11,11', function () {
      scope.testForm.testInput.$setViewValue('-11,11');
      expect(scope.testInput).toEqual('-11.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-11,11');
    });
    it('should have view value -0,11 and model value -0.11 when set -0,11', function () {
      scope.testForm.testInput.$setViewValue('-0,11');
      expect(scope.testInput).toEqual('-0.11');
      expect(scope.testForm.testInput.$viewValue).toEqual('-0,11');
    });
    it('should not have view value 11.11 and model value 11.11 when set 11.11', function () {
      scope.testForm.testInput.$setViewValue('11.11');
      expect(scope.testInput).not.toEqual('11.11');
      expect(scope.testForm.testInput.$viewValue).not.toEqual('11.11');
    });
  });
});