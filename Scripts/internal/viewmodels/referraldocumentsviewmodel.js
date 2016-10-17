function ReferralDocumentsViewModel(argon) {
    var vm = this;
    vm.applicationReference = ko.observable();
    vm.firstName = ko.observable("");
    vm.referralDocumentRequests = ko.observableArray();
    vm.documentTypes = ko.observableArray();
    vm.documentTypeInfoTemplate = ko.observable('upload-info-other');
    vm.uploadDocumentType = ko.observable("Identity");
    vm.uploadedDocumentIndex = ko.observable();
    vm.successPanelViewModel = ko.observable(new SuccessPanelViewModel(false));
    vm.displayStep2 = ko.observable(false);
    vm.displayStep3 = ko.observable(false);
    vm.errors = ko.observableArray();
    vm.step2Name = ko.observable('Step 2. Select which type of document you wish to upload:');
    vm.docType = {
        Identity: 1,
        Address: 2,
        BankAccount: 3
    }
    vm.docStatus = {
        ReadyToUpload: 1,
        Processing: 2,
        Accepted: 3,
        UnclearImage: 4,
        NotEnoughInformation: 5,
        UnclearImageAndNotEnoughInformation: 6,
        TryAgain: 7,
        ContainsSensitiveData: 8,
        InformationMismatch: 9,
        OutOfDateDocument: 10,
        NotAcceptedDocument: 11,
        DuplicateDocument: 12,
        RequireColourImage: 13
    }

    vm.displayErrors = ko.pureComputed(function () {
        return ko.utils.arrayFirst(vm.errors(), function (error) {
            return error.visible() === true;
        }) != null;
    }, vm);

    vm.pageIntroTemplateName = ko.pureComputed(function () {
        if (vm.firstName.length > 0) {
            return 'page-intro-returned';
        }
        return 'page-intro-documents-required';
    }, vm);

    vm.isAwaitingDocumentVerification = ko.pureComputed(function () {
        var processing = ko.utils.arrayFilter(vm.referralDocumentRequests(), function (item) {
            return item.status === vm.docStatus.Processing || item.status === vm.docStatus.Accepted;
        });
        if (processing.length === vm.referralDocumentRequests().length) {
            return true;
        }
        return false;
    }, vm);

    vm.isAwaitingDocuments = ko.pureComputed(function () {
        var readyToUpload = ko.utils.arrayFilter(vm.referralDocumentRequests(), function (item) {
            return item.status === vm.docStatus.ReadyToUpload || vm.isRejectedDocument(item.status);
        });
        if (readyToUpload.length > 0) {
            return true;
        }
        return false;
    }, vm);

    vm.countDocumentsToUpload = ko.pureComputed(function () {
        return ko.utils.arrayFilter(vm.referralDocumentRequests(), function (item) {
            return item.status === vm.docStatus.ReadyToUpload || vm.isRejectedDocument(item.status);
        }).length;
    }, vm);

    vm.displayCountDocumentsToUpload = ko.pureComputed(function () {
        var readyToUpload = ko.utils.arrayFilter(vm.referralDocumentRequests(), function (item) {
            return item.status === vm.docStatus.ReadyToUpload || vm.isRejectedDocument(item.status);
        });
        if (readyToUpload.length <= 0) {
            return "no documents";
        }
        if (readyToUpload.length === 1) {
            return "1 document";
        }
        return vm.countDocumentsToUpload() + " documents";
    }, vm);

    vm.isRejectedDocument = (function (status) {
        if (status === vm.docStatus.TryAgain ||
            status === vm.docStatus.UnclearImage ||
            status === vm.docStatus.ContainsSensitiveData ||
            status === vm.docStatus.InformationMismatch ||
            status === vm.docStatus.NotAcceptedDocument ||
            status === vm.docStatus.OutOfDateDocument ||
            status === vm.docStatus.DuplicateDocument ||
            status === vm.docStatus.RequireColourImage ||
            status === vm.docStatus.NotEnoughInformation ||
            status === vm.docStatus.UnclearImageAndNotEnoughInformation) {
            return true;
        }
        return false;
    });

    vm.isReadyToUpload = (function (status) {
        if (status === vm.docStatus.ReadyToUpload ||
            status === vm.docStatus.TryAgain ||
            status === vm.docStatus.UnclearImage ||
            status === vm.docStatus.ContainsSensitiveData ||
            status === vm.docStatus.InformationMismatch ||
            status === vm.docStatus.NotAcceptedDocument ||
            status === vm.docStatus.OutOfDateDocument ||
            status === vm.docStatus.DuplicateDocument ||
            status === vm.docStatus.RequireColourImage ||
            status === vm.docStatus.NotEnoughInformation ||
            status === vm.docStatus.UnclearImageAndNotEnoughInformation) {
            return true;
        }
        return false;
    });

    vm.selectReferralDocumentRequest = function () {
        if (this.disabled()) {
            return false;
        }
        ko.utils.arrayForEach(vm.referralDocumentRequests(), function (item) {
            item.selected(false);
        });
        this.selected(true);

        //Set all document types to not visible
        ko.utils.arrayForEach(vm.documentTypes(), function (item) {
            item.selected(false);
        });

        //Get list of acceptable document types.
        var acceptabledocumentTypes = this.acceptableDocumentTypes();

        //Then set which types of documents can be uploaded ie Utility bill.
        vm.documentTypes(acceptabledocumentTypes);

        //Set the sentence based on how many document types are returned.
        if (acceptabledocumentTypes.length === 1) {
            vm.step2Name("Step 2. Please click to upload the document below:");
        } else {
            vm.step2Name("Step 2. Select which type of document you wish to upload:");
        }

        //Hidden fields for the upload form
        vm.uploadDocumentType(this.type);
        vm.uploadedDocumentIndex(vm.referralDocumentRequests().indexOf(this));

        //Step state control
        vm.displayStep2(true);
        vm.displayStep3(false);

        //Set which errors to display
        var docStatus = this.status;
        ko.utils.arrayForEach(vm.errors(), function (item) {
            item.visible(false);
            if (item.type === docStatus) {
                item.visible(true);
            }
        });

        return true;
    }
    vm.selectDocumentType = function () {
        ko.utils.arrayForEach(vm.documentTypes(), function (item) {
            item.selected(false);
        });
        vm.documentTypeInfoTemplate(this.infoTemplate());
        this.selected(true);
        vm.displayStep3(true);
    }

    vm.init = function (model) {
        //Mapping to KO
        vm.applicationReference = model.ApplicationReference.toUpperCase();
        vm.firstName = model.FirstName;

        //Rejected document reasons
        $.each(model.RejectedReasons, function (rejectedIndex, rejectedReason) {
            vm.errors().push(new ErrorViewModel(rejectedReason, false, vm));
        });

        //Document request icons & status
        var identityDocuments = ko.utils.arrayFilter(model.DocumentRequests, function (item) {
            return item.Type === vm.docType.Identity;
        });

        var addressDocuments = ko.utils.arrayFilter(model.DocumentRequests, function (item) {
            return item.Type === vm.docType.Address;
        });

        var bankDocuments = ko.utils.arrayFilter(model.DocumentRequests, function (item) {
            return item.Type === vm.docType.BankAccount;
        });

        $.each(identityDocuments, function (referralDocIndex, referralDoc) {
            vm.referralDocumentRequests().push(new ReferralDocumentRequestViewModel(referralDoc.Type, referralDoc.Status, false, referralDocIndex + 1, identityDocuments.length, vm));
        });

        $.each(bankDocuments, function (referralDocIndex, referralDoc) {
            vm.referralDocumentRequests().push(new ReferralDocumentRequestViewModel(referralDoc.Type, referralDoc.Status, false, referralDocIndex + 1, bankDocuments.length, vm));
        });

        $.each(addressDocuments, function (referralDocIndex, referralDoc) {
            vm.referralDocumentRequests().push(new ReferralDocumentRequestViewModel(referralDoc.Type, referralDoc.Status, false, referralDocIndex + 1, addressDocuments.length, vm));
        });

        //Successful document upload
        if (model.UploadedDocumentIndex != -1) {

            var documentRequest = vm.referralDocumentRequests()[model.UploadedDocumentIndex];
            documentRequest.status = vm.docStatus.Processing;

            switch (documentRequest.type) {
                case vm.docType.Identity:
                    vm.successPanelViewModel = new SuccessPanelViewModel(true).content("proof of identity");
                    break;
                case vm.docType.BankAccount:
                    vm.successPanelViewModel = new SuccessPanelViewModel(true).content("proof of bank account");
                    break;
                case vm.docType.Address:
                    vm.successPanelViewModel = new SuccessPanelViewModel(true).content("proof of address");
                    break;
            }
        }
    }
}

function ReferralDocumentRequestViewModel(type, status, selected, typeIndex, typeTotal, rootVm) {
    var vm = this;
    vm.type = type;
    vm.status = status;
    vm.typeCount = typeIndex;
    vm.typeTotal = typeTotal;
    vm.selected = ko.observable(selected);
    vm.displayStatus = ko.pureComputed(function () {
        switch (vm.status) {
            case rootVm.docStatus.ReadyToUpload:
                return "Please upload";
            case rootVm.docStatus.Processing:
                return "Submitted";
            case rootVm.docStatus.TryAgain:
                return "Please upload";
            case rootVm.docStatus.NotEnoughInformation:
                return "Please upload";
            case rootVm.docStatus.UnclearImage:
                return "Please upload";
            case rootVm.docStatus.ContainsSensitiveData:
                return "Please upload";
            case rootVm.docStatus.NotAcceptedDocument:
                return "Please upload";
            case rootVm.docStatus.DuplicateDocument:
                return "Please upload";
            case rootVm.docStatus.InformationMismatch:
                return "Please upload";
            case rootVm.docStatus.OutOfDateDocument:
                return "Please upload";
            case rootVm.docStatus.RequireColourImage:
                return "Please upload";
            case rootVm.docStatus.UnclearImageAndNotEnoughInformation:
                return "Please upload";
            case rootVm.docStatus.Accepted:
                return "Accepted";
            default:
                return "Processing";
        }
    }, vm);
    vm.acceptableDocumentTypes = ko.pureComputed(function () {
        switch (vm.type) {
            case 1:
                return ([
                    new DocumentTypeViewModel("Passport", false, rootVm),
                    new DocumentTypeViewModel("DrivingLicense", false, rootVm),
                    new DocumentTypeViewModel("IdentityCard", false, rootVm)
                ]);

            case 3:
                return ([
                    new DocumentTypeViewModel("BankStatement", false, rootVm)
                ]);
            case 2:
                return ([
                    new DocumentTypeViewModel("BankStatement", false, rootVm),
                    new DocumentTypeViewModel("UtilityBill", false, rootVm),
                    new DocumentTypeViewModel("CouncilTax", false, rootVm)
                ]);
        }

        return ko.observableArray();
    }, vm);
    vm.displayType = ko.pureComputed(function () {
        var name = "";
        switch (vm.type) {
            case rootVm.docType.Identity:
                name = "Proof of identity";
                break;
            case rootVm.docType.BankAccount:
                name = "Proof of bank account";
                break;
            case rootVm.docType.Address:
                name = "Proof of address";
                break;
        }
        if (vm.typeTotal === 1) {
            return name;
        }
        return name + " " + vm.typeCount;
    }, vm);
    vm.icon = ko.pureComputed(function () {
        switch (vm.type) {
            case rootVm.docType.Identity:
                return "poi";
            case rootVm.docType.BankAccount:
                return "pob";
            case rootVm.docType.Address:
                return "poa1";
            default:
                return "";
        }
    }, vm);
    vm.id = ko.pureComputed(function () {
        switch (vm.type) {
            case rootVm.docType.Identity:
                return "#poi_btn";
            case rootVm.docType.BankAccount:
                return "#pob_btn";
            case rootVm.docType.Address:
                return "#poa1_btn";
            default:
                return "";
        }
    }, vm);
    vm.isTryAgain = ko.pureComputed(function () {
        return rootVm.isRejectedDocument(vm.status);
    }, vm);
    vm.isProcessing = ko.pureComputed(function () {
        return vm.status === rootVm.docStatus.Processing;
    }, vm);
    vm.isAccepted = ko.pureComputed(function () {
        return vm.status === rootVm.docStatus.Accepted;
    }, vm);
    vm.disabled = ko.pureComputed(function () {
        return vm.status === rootVm.docStatus.Processing || vm.status === rootVm.docStatus.Accepted ? true : false;
    }, vm);
    vm.active = ko.pureComputed(function () {
        return vm.selected() === true && vm.status === rootVm.docStatus.ReadyToUpload ? true : false;
    }, vm);
    vm.visible = ko.pureComputed(function () {
        return true;
    }, vm);
}

function DocumentTypeViewModel(type, selected, rootVm) {
    var vm = this;
    vm.type = type;
    vm.selected = ko.observable(selected);
    vm.displayType = ko.pureComputed(function () {
        switch (vm.type) {
            case "Passport":
                return "Passport";
            case "DrivingLicense":
                return "Driving license";
            case "IdentityCard":
                return "EUID Card";
            case "UtilityBill":
                return "Utility bill";
            case "CouncilTax":
                return "Council tax bill";
            case "BankStatement":
                return "Bank statement";
            default:
                return null;
        }
    }, vm);
    vm.icon = ko.pureComputed(function () {
        switch (vm.type) {
            case "Passport":
                return "poi-passport";
            case "DrivingLicense":
                return "poi-drivingLicence";
            case "IdentityCard":
                return "poi-euIdCard";
            case "UtilityBill":
                return "poa-utilityBill";
            case "CouncilTax":
                return "poa-councilTax";
            case "BankStatement":
                return "poa-bankStatment";
            default:
                return null;
        }
    }, vm);
    vm.infoTemplate = ko.pureComputed(function () {
        switch (vm.type) {
            case "Passport":
                return 'upload-info-passport';
            case "DrivingLicense":
                return 'upload-info-driving';
            case "IdentityCard":
                return 'upload-info-idcard';
            case "UtilityBill":
                return 'upload-info-utility';
            case "CouncilTax":
                return 'upload-info-counciltax';
            case "BankStatement":
                return 'upload-info-bankstatement';
            default:
                return null;
        }
    }, vm);
}

function SuccessPanelViewModel(visible) {
    var vm = this;
    vm.content = ko.observable("");
    vm.visible = ko.observable(visible);
}

function ErrorViewModel(type, visible, rootVm) {
    var vm = this;
    vm.type = type;
    vm.error = ko.pureComputed(function () {
        switch (type) {
            case rootVm.docStatus.NotEnoughInformation:
                return "Unfortunately your image does not contain the required information to enable our team to accept it. Please review step 3 'uploading your image' to ensure it contains the correct details to enable us to progress your application.";
            case rootVm.docStatus.UnclearImage:
                return "Unfortunately your image is not clear enough for our team to accept. Please review step 3 'tips for taking a photo' to ensure your next document is clear and we can read it.";
            case rootVm.docStatus.UnclearImageAndNotEnoughInformation:
                return "Unfortunately your document does not contain the required information and the image is not clear enough for our team to be able to accept it. Please review step 3 'uploading your image and tips for taking a photo' prior to uploading your next documents.";
            case rootVm.docStatus.ContainsSensitiveData:
                return "Please provide an alternative document type as we do not accept photos of documents that carry 16 digit card numbers for data security. Please send a copy of your most recent bank statement which includes name, address, bank account number, sort code and logo.";
            case rootVm.docStatus.DuplicateDocument:
                return "Please provide a unique document for each document required, we cannot accept two documents the same.";
            case rootVm.docStatus.InformationMismatch:
                return "Please ensure that the personal information on the provided document (e.g. name, address, date of birth) matches what you submitted on your application.";
            case rootVm.docStatus.NotAcceptedDocument:
                return "The document you have supplied is not a document we accept and is therefore invalid, please check the list for documents we accept to prevent your document being declined.";
            case rootVm.docStatus.OutOfDateDocument:
                return "Please make sure the ID document you supply is in date and has not expired, and any other documents are dated within the last 3 months otherwise we cannot accept the document.";
            case rootVm.docStatus.RequireColourImage:
                return "Please provide a colour image of your document to ensure we are able to view all the information we require.";
            default:
                return "";
        }
    }, vm);
    vm.visible = ko.observable(visible);
}