'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
	$locationProvider.hashPrefix('');
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
  });
}])

.controller('homeController', ['$scope','$http','$interval','$timeout',function($scope,$http,$interval,$timeout) {

	$scope.cryptoTypes = ['BTC-BitCoin','BCH-Bitcoin Cash','LTC-LiteCoin','ETH-Ethereum','ZEC-ZCash','DASH-Dash'
						 ,'XRP-Ripple','XMR-Monero'];
	$scope.currencyTypes = ['USD','AUD','EUR'];
	$scope.Crypto = 'BTC';
	$scope.Currency = 'USD';
	$scope.marketArray = [];
	$scope.currentTime = 0;
	$scope.base = "";
	$scope.price = 0;
	$scope.volume = 0;
	$scope.change = 0;
	let labels12 = [], data1 = [], data2 = [];
	let newChart = document.getElementById("barChart1").getContext('2d');

	$scope.selectedCurrencyChanged = function(){
    $scope.Currency = $scope.selectedCurrency;
    getTicker();
  }

  $scope.selectedCryptoChanged = function(){
    $scope.Crypto =  ($scope.selectedCrypto.split('-'))[0];
    getTicker();
  }

	var getTicker = function(){

		$http.get(' https://api.cryptonator.com/api/full/' + $scope.Crypto + "-" + $scope.Currency)
		.then(function successCallback(response){
			$scope.result = response.data;
			$scope.marketArray = $scope.result.ticker.markets;
			$scope.base = $scope.result.ticker.base;
			$scope.price = $scope.result.ticker.price;
			$scope.volume = $scope.result.ticker.volume;
			$scope.change = $scope.result.ticker.change;
			$scope.currentTime = Date();
			getChart();
		}),
		function errorCallback(response) {
			console.log("page is invalid")};

		

		
	}
	let getChart = function(){
		// get the labels and data for the bar charts
		labels12 = [];  data1 = []; data2 = [];
		let backgroundColors = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3d9e9c",
								"#ff0000","#ff9d00","#cfb2e1","#b89647","#395c24","#dad6a0"];
		for(let eachElem of $scope.marketArray){
			labels12.push(eachElem.market);
			data1.push(eachElem.price);
			data2.push(eachElem.volume);
		};

		// Create bar chart using chartjs
		
		if($scope.canvas1!=null){$scope.canvas1.destroy();}
		
		$scope.canvas1 = new Chart(newChart, {
		    type: 'bar',
		    data: {
		      labels: labels12,
		      datasets: [
		        {
		          label: "Price ($)",
		          backgroundColor: backgroundColors,
		          data: data1
		        }
		      ]
		    },
		    options: {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: $scope.Crypto + ' trading prices',
		        fontSize: 16
		      }
		    }
		});
	};

	getTicker();
	$interval(getTicker,30000);
	
}]);