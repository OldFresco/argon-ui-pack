function ApplicationViewModel(argon, globalize) {
    var self = this;

    LoanIllustrationViewModel.call(self, argon, globalize);

    //steps....
    self.currentStep = ko.observable('step1');

    self.switchStep = function (step) {
        if (!argon.validation.validateCurrentStep()) {
            return;
        }

        this.currentStep(step);
    };
    
    //contractual loan amounts....
    self.tierAMonthlyInstalment = ko.computed(function () {
        var monthlyInstalment = argon.loanCalculator.calculateMonthlyInstalment(this.loanAmount(), this.loanTermInMonths(), argon.tiers.tierAAnnualPercentageRate);
        return globalize.format(monthlyInstalment, "n2");
    }, self);

    self.tierBMonthlyInstalment = ko.computed(function () {
        var monthlyInstalment = argon.loanCalculator.calculateMonthlyInstalment(this.loanAmount(), this.loanTermInMonths(), argon.tiers.tierBAnnualPercentageRate);
        return globalize.format(monthlyInstalment, "n2");
    }, self);

    self.tierATotalAmountRepayable = ko.computed(function () {
        var totalAmountRepayable = argon.loanCalculator.calculateTotalAmountRepayable(this.tierAMonthlyInstalment(), this.loanTermInMonths());
        return globalize.format(totalAmountRepayable, "n2");
    }, self);
    
    self.tierBTotalAmountRepayable = ko.computed(function () {
        var totalAmountRepayable = argon.loanCalculator.calculateTotalAmountRepayable(this.tierBMonthlyInstalment(), this.loanTermInMonths());
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
