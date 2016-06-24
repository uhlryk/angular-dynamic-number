describe('Angular-dynamic-number basic', function() {
  beforeEach(function(){
    module('dynamicNumber');
  });
  describe('directive', function(){
    var $compile, $scope, dynamicNumberStrategyProvider;
    beforeEach(function(){
      module(function(_dynamicNumberStrategyProvider_){
        dynamicNumberStrategyProvider = _dynamicNumberStrategyProvider_;
      });
    });
    beforeEach(function () {
      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.testInput = "";
      });
    });
    describe('test init values', function() {
      it('should have view value "" and model value "" when init value is ""', function () {
        $scope.testInput = "";
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual('');
        expect($scope.testForm.testInput.$viewValue).toEqual('');
      });
      it('should have view value "12" and model value 12 when init value is 12', function () {
        $scope.testInput = 0;
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual(0);
        expect($scope.testForm.testInput.$viewValue).toEqual('0');
      });
      it('should have view value "12" and model value 12 when init value is 12', function () {
        $scope.testInput = 12;
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual(12);
        expect($scope.testForm.testInput.$viewValue).toEqual('12');
      });
      it('should have view value "" and model value null when init value is null', function () {
        $scope.testInput = null;
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual(null);
        expect($scope.testForm.testInput.$viewValue).toEqual('');
      });
      it('should have view value "" and model value undefined when init value is undefined', function () {
        $scope.testInput = undefined;
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual(undefined);
        expect($scope.testForm.testInput.$viewValue).toEqual('');
      });
      //directive modify model only when user types to input. Id doesn't change it only because init model value is wrong -this is responsibility of dev to have correct init value.
      it('should have view value "" and model value string when init value is string', function () {
        $scope.testInput = 'dsads';
        $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum/></form>')($scope);
        $scope.$digest();

        expect($scope.testInput).toEqual('dsads');
        expect($scope.testForm.testInput.$viewValue).toEqual('0');
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
    describe('number format: 2 integeres, decimals comma separator, positive and negative, dot thousand separator', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="8" num-sep="," num-fract="2" num-thousand="true"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 111.111,11 and model value 111111.11 when set 111.111,11', function () {
        $scope.testForm.testInput.$setViewValue('111.111,11');
        expect($scope.testInput).toEqual('111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('111.111,11');
      });
      it('should have view value -111.111,11 and model value -111111.11 when set -111.111,11', function () {
        $scope.testForm.testInput.$setViewValue('-111.111,11');
        expect($scope.testInput).toEqual('-111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-111.111,11');
      });
    });
    describe('number format: 2 integeres, decimals dot separator, positive and negative, comma thousand separator', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="8" num-sep="." num-fract="2" num-thousand="true"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 111,111.11 and model value 111111.11 when set 111,111.11', function () {
        $scope.testForm.testInput.$setViewValue('111,111.11');
        expect($scope.testInput).toEqual('111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('111,111.11');
      });
      it('should have view value -111,111.11 and model value -111111.11 when set -111,111.11', function () {
        $scope.testForm.testInput.$setViewValue('-111,111.11');
        expect($scope.testInput).toEqual('-111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-111,111.11');
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
    describe('number format: 6 integeres, decimals dot separator, positive and negative, space thousand separator', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="8" num-sep="." num-fract="2" num-thousand="true"  num-thousand-sep="{{\' \'}}"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 111 111.11 and model value 111111.11 when set 111 111.11', function () {
        $scope.testForm.testInput.$setViewValue('111 111.11');
        expect($scope.testInput).toEqual('111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('111 111.11');
      });
      it('should have view value -111 111.11 and model value -111111.11 when set -111 111.11', function () {
        $scope.testForm.testInput.$setViewValue('-111 111.11');
        expect($scope.testInput).toEqual('-111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-111 111.11');
      });
    });
    describe('number format: 6 integeres, decimals dot separator, positive and negative, apostrophe thousand separator', function() {
      beforeEach(function(){
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum num-int="8" num-sep="." num-fract="2" num-thousand="true"  num-thousand-sep="\'"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 111\'111.11 and model value 111111.11 when set 111\'111.11', function () {
        $scope.testForm.testInput.$setViewValue('111\'111.11');
        expect($scope.testInput).toEqual('111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('111\'111.11');
      });
      it('should have view value -111\'111.11 and model value -111111.11 when set -111\'111.11', function () {
        $scope.testForm.testInput.$setViewValue('-111\'111.11');
        expect($scope.testInput).toEqual('-111111.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-111\'111.11');
      });
    });
    describe('custom strategy provider', function(){
      beforeEach(function(){
        dynamicNumberStrategyProvider.addStrategy('price', {
          numInt: 6,
          numFract: 2,
          numSep: '.',
          numPos: true,
          numNeg: true,
          numRound: 'round',
          numThousand: true
        });
        var el = $compile('<form name="testForm"><input type="text" name="testInput" ng-model="testInput" awnum="price"/></form>')($scope);
        $scope.$digest();
      });
      it('should have view value 11.11 and model value 11.11 when set 11.11', function () {
        $scope.testForm.testInput.$setViewValue('11.11');
        expect($scope.testInput).toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('11.11');
      });
      it('should have view value 0.11 and model value 0.11 when set 0.11', function () {
        $scope.testForm.testInput.$setViewValue('0.11');
        expect($scope.testInput).toEqual('0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('0.11');
      });
      it('should have view value -11.11 and model value -11.11 when set -11.11', function () {
        $scope.testForm.testInput.$setViewValue('-11.11');
        expect($scope.testInput).toEqual('-11.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-11.11');
      });
      it('should have view value -0.11 and model value -0.11 when set -0.11', function () {
        $scope.testForm.testInput.$setViewValue('-0.11');
        expect($scope.testInput).toEqual('-0.11');
        expect($scope.testForm.testInput.$viewValue).toEqual('-0.11');
      });
      it('should not have view value 11.11 and model value 11.11 when set 11,11', function () {
        $scope.testForm.testInput.$setViewValue('11,11');
        expect($scope.testInput).not.toEqual('11.11');
        expect($scope.testForm.testInput.$viewValue).not.toEqual('11.11');
      });
    });
  });
  describe('filter', function(){
    var $filter, dynamicNumberStrategyProvider;
    beforeEach(function() {
      module(function(_dynamicNumberStrategyProvider_) {
        dynamicNumberStrategyProvider = _dynamicNumberStrategyProvider_;
      });
    });
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
    describe('number format: 6 integeres, decimals comma separator, thousand dot separator', function() {
      it('should return 1.111,29 when value \'1111.287\' ', function () {
        expect($filter('awnum')('1111.287',2, ',','round','false','true')).toEqual('1.111,29');
      });
    });
    describe('filter with custom strategy', function() {
      beforeEach(function() {
        dynamicNumberStrategyProvider.addStrategy('price', {
          numFract: 1,
          numSep: '.',
          numPos: true,
          numNeg: true,
          numRound: 'round',
          numThousand: true
        });
      });
      it('should return 1,111.2 when value \'1111.16\' ', function () {
        expect($filter('awnum')('1111.16', 'price')).toEqual('1,111.2');
      });
      it('should return 1.111,2 when value \'1111.16\' ', function () {
        expect($filter('awnum')('1111.16', 'price', ',')).toEqual('1.111,2');
      });
    });
  });
});
