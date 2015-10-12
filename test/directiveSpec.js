describe('Angular-dynamic-number basic', function() {
  beforeEach(function(){
    module('dynamicNumber');
  });
  describe('directive', function(){
    var $compile, $$scope;
    beforeEach(function () {
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.testInput = "";
      });
    });
    describe('number format: 2 integeres, decimals dot separator, positive and negative', function() {
      beforeEach(function(){
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="." num-fract="2"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 11.11 and model value 11.11 when set 11.11', function () {
        $scope.testForm.testInput.$setViewValue('11.11');
        expect($scope.testInput).toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('11.11');
      });
      it('should not have view value 111.11 and model value 111.11 when set 111.11', function () {
        $scope.testForm.testInput.$setViewValue('111.11');
        expect($scope.testInput).not.toEqual('111.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('111.11');
      });
      it('should not have view value 11.111 and model value 11.111 when set 11.111', function () {
        $scope.testForm.testInput.$setViewValue('111.11');
        expect($scope.testInput).not.toEqual('111.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('111.11');
      });
      it('should have view value 0.11 and model value 0.11 when set 0.11', function () {
        $scope.testForm.testInput.$setViewValue('0.11');
        expect($scope.testInput).toEqual('0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('0.11');
      });
      it('should not have view value 00.11 and model value 00.11 when set 00.11', function () {
        $scope.testForm.testInput.$setViewValue('00.11');
        expect($scope.testInput).not.toEqual('00.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('00.11');
      });
      it('should have view value -11.11 and model value -11.11 when set -11.11', function () {
        $scope.testForm.testInput.$setViewValue('-11.11');
        expect($scope.testInput).toEqual('-11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-11.11');
      });
      it('should not have view value -111.11 and model value -111.11 when set -111.11', function () {
        $scope.testForm.testInput.$setViewValue('-111.11');
        expect($scope.testInput).not.toEqual('-111.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('-111.11');
      });
      it('should not have view value -11.111 and model value -11.111 when set -11.111', function () {
        $scope.testForm.testInput.$setViewValue('-111.11');
        expect($scope.testInput).not.toEqual('-111.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('-111.11');
      });
      it('should have view value -0.11 and model value -0.11 when set -0.11', function () {
        $scope.testForm.testInput.$setViewValue('-0.11');
        expect($scope.testInput).toEqual('-0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-0.11');
      });
      it('should not have view value -00.11 and model value -00.11 when set -00.11', function () {
        $scope.testForm.testInput.$setViewValue('-00.11');
        expect($scope.testInput).not.toEqual('-00.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('-00.11');
      });
      it('should not have view value 11,11 and model value 11.11 when set 11,11', function () {
        $scope.testForm.testInput.$setViewValue('11,11');
        expect($scope.testInput).not.toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('11,11');
      });
    });
    describe('number format: 2 integeres, decimals comma separator, positive and negative', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="," num-fract="2"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 11,11 and model value 11.11 when set 11,11', function () {
        $scope.testForm.testInput.$setViewValue('11,11');
        expect($scope.testInput).toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('11,11');
      });
      it('should have view value 0,11 and model value 0.11 when set 0,11', function () {
        $scope.testForm.testInput.$setViewValue('0,11');
        expect($scope.testInput).toEqual('0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('0,11');
      });
      it('should have view value -11,11 and model value -11.11 when set -11,11', function () {
        $scope.testForm.testInput.$setViewValue('-11,11');
        expect($scope.testInput).toEqual('-11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-11,11');
      });
      it('should have view value -0,11 and model value -0.11 when set -0,11', function () {
        $scope.testForm.testInput.$setViewValue('-0,11');
        expect($scope.testInput).toEqual('-0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-0,11');
      });
      it('should not have view value 11.11 and model value 11.11 when set 11.11', function () {
        $scope.testForm.testInput.$setViewValue('11.11');
        expect($scope.testInput).not.toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('11.11');
      });
    });
    describe('number format: 2 integeres, decimals comma separator, negative', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="2" num-sep="," num-fract="2" num-pos="false"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 11,11 and model value 11.11 when set 11,11', function () {
        $scope.testForm.testInput.$setViewValue('11,11');
        expect($scope.testInput).not.toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('11,11');
      });
      it('should have view value -11,11 and model value -11.11 when set -11,11', function () {
        $scope.testForm.testInput.$setViewValue('-11,11');
        expect($scope.testInput).toEqual('-11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-11,11');
      });
      it('should have view value -0,11 and model value -0.11 when set -0,11', function () {
        $scope.testForm.testInput.$setViewValue('-0,11');
        expect($scope.testInput).toEqual('-0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-0,11');
      });
      it('should not have view value 11.11 and model value 11.11 when set 11.11', function () {
        $scope.testForm.testInput.$setViewValue('11.11');
        expect($scope.testInput).not.toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('11.11');
      });
    });
  });
  describe('filter', function(){
    var $filter;
    beforeEach(inject(function(_$filter_){
      $filter = _$filter_;
    }));
    describe('number format: 2 integeres, decimals comma separator, negative', function() {
      it('should return 0 when value null', function () {
        expect($filter('awnum')(null)).toEqual('0');
      });
      it('should return 0 when value \'abc\' ', function () {
        expect($filter('awnum')('abc')).toEqual('0');
      });
      it('should return 11,29 when value \'11.287\' ', function () {
        expect($filter('awnum')('11.287',2, ',','round')).toEqual('11,29');
      });
      it('should return 11,00 when value \'11\' and fixed fraction digit number is 2', function () {
        expect($filter('awnum')('11.00',2, ',','round','true')).toEqual('11,00');
      });
    });
  });
});