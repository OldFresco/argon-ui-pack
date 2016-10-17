function LoanIllustrationViewModel(argon, globalize) {
    var self = this;

    self.loanAmount = ko.observable(argon.currentView.loanAmount);
    self.loanTermInMonths = ko.observable(argon.currentView.loanTermInMonths);
    self.annualPercentageRate = argon.currentView.annualPercentageRate;

    self.monthlyInstalment = ko.computed(function () {
        var monthlyInstalment = argon.loanCalculator.calculateMonthlyInstalment(this.loanAmount(), this.loanTermInMonths(), this.annualPercentageRate);
        return globalize.format(monthlyInstalment, "n2");
    }, self);

    self.totalAmountRepayable = ko.computed(function () {
        var totalAmountRepayable = argon.loanCalculator.calculateTotalAmountRepayable(argon.loanCalculator.calculateMonthlyInstalment(this.loanAmount(), this.loanTermInMonths(), this.annualPercentageRate), this.loanTermInMonths());
        return globalize.format(totalAmountRepayable, "n2");
    }, self);


    self.repExampleLoanAmount = 2000;
    self.repExampleLoanTermInMonths = 24;

    self.repExampleMonthlyInstalment = ko.computed(function () {
        var monthlyInstalment = argon.loanCalculator.calculateMonthlyInstalment(this.repExampleLoanAmount, this.repExampleLoanTermInMonths, this.annualPercentageRate);
        return globalize.format(monthlyInstalment, "n2");
    }, self);

    self.repExampleTotalAmountRepayable = ko.computed(function () {
        var totalAmountRepayable = argon.loanCalculator.calculateTotalAmountRepayable(argon.loanCalculator.calculateMonthlyInstalment(this.repExampleLoanAmount, this.repExampleLoanTermInMonths, this.annualPercentageRate), this.repExampleLoanTermInMonths);
        return globalize.format(totalAmountRepayable, "n2");
    }, self);

    self.displayAnnualPercentageRate = ko.computed(function () {
        return globalize.format(this.annualPercentageRate * 100, "n1");
    }, self);
}