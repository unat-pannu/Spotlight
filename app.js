var app = angular.module("talentApp", []);
app.controller("TalentController", function ($scope, $http) {
    $scope.sortBy = "name";
    $scope.limit = 10;
    $scope.selectedTalent = null;
    $http.get("talents.json").then(function (response) {
        $scope.talents = response.data;
    });
    $scope.$watch("selectedTalent", function (newVal, oldVal) {
        if (newVal !== oldVal && newVal !== null) {
            console.log("Talent selected:", newVal);
            $scope.$broadcast("talentSelected", newVal);
        }
    });
    $scope.openModal = function (talent) {
        $scope.selectedTalent = talent;
        $scope.$emit("modalOpened", talent);
    };
    $scope.closeModal = function () {
        $scope.selectedTalent = null;
    };
    $scope.$on("talentSelected", function (event, data) {
        console.log("Talent Selected Event Received:", data);
    });
    $scope.$on("modalOpened", function (event, data) {
        console.log("Modal Opened for:", data.name);
    });
});
