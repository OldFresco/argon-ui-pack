;
(function (loanCalculator, undefined) {

    loanCalculator.calculateMonthlyInstalment = function (loanAmount, loanTermInMonths, annualPercentageRate) {
        var monthlyInterestRate = Math.pow(1 + annualPercentageRate, 1 / 12) - 1;

        // aka. PMT function
        var instalment = (monthlyInterestRate * loanAmount * Math.pow((1 + monthlyInterestRate), loanTermInMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1);

        return instalment.toFixed(2);
    };

    loanCalculator.calculateTotalAmountRepayable = function (monthlyInstalment, term) {
        return monthlyInstalment * term;
    };

})(namespace('argon.loanCalculator'));