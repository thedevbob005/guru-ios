var user = localStorage.getItem('gurusikshauser')
var userId = localStorage.getItem('userId')
var userType = localStorage.getItem('userType')
var userImage = localStorage.getItem('userImage')
var url = 'http://guru-siksha.com/manage_api/'
postCountStudent = 0
postCountMentor = 0
postCountGardian = 0
postCount = 5
examCount = 10
var imagePost = ''

var phonegapApp = {
    initialize: function () {
        this.bindEvents()
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false)
        document.addEventListener("backbutton", onBackKeyDown, false)
    },
    onDeviceReady: function () {
        if (!user) {
            app.popup.open('#my-login-register-screen')
        }
        else {
            if (userType == "S") {
                phonegapApp.userDetails(user)
                phonegapApp.studentTimeline()
                phonegapApp.mentorListSearch()
                phonegapApp.studentMentors()
                phonegapApp.getDayList()
                $('#toolBarSearch').show()
                $('#toolBarSearch').attr('href', '#view-catalog')
                $('#toolBarSearch').html('<i class="material-icons md-only icon">search</i>')
            }
            else if (userType == "M") {
                phonegapApp.userDetails(user)
                phonegapApp.mentorTimeline()
                phonegapApp.getDayList()
                phonegapApp.exploreClass()
                $('#toolBarSearch').show()
                $('#toolBarSearch').attr('href', '#view-explore')
                $('#toolBarSearch').html('<i class="material-icons md-only icon">explore</i>')
            }
            else {
                phonegapApp.userDetails(user)
                phonegapApp.guardianTimeline()
                phonegapApp.mentorListSearch()
                $('#toolBarSearch').show()
                $('#toolBarSearch').attr('href', '#view-catalog')
                $('#toolBarSearch').html('<i class="material-icons md-only icon">search</i>')
            }
        }
    },

    // This section for open login-register-screen
    openLoginRegister: function () {
        app.popup.close('#my-login-screen')
        app.popup.close('#gurdians-signup-screen')
        app.popup.close('#student-signup-screen')
        app.popup.close('#mentor-signup-screen')
        app.popup.close('#my-login-screen-student-login')
        app.popup.close('#forgot-studentid-screen')
        app.popup.open('#my-login-register-screen')
    },

    // This section for open login screen
    openLogin: function () {
        app.popup.close('#my-login-register-screen')
        app.popup.open('#my-login-screen')
    },

    // Open Student Signup Screen
    openStudentSignupScreen: function () {
        app.popup.close('#my-login-register-screen')
        app.popup.open('#student-signup-screen')
    },

    // Open Gurdians Signup Screen
    openGurdiansSignupScreen: function () {
        app.popup.close('#my-login-register-screen')
        app.popup.open('#gurdians-signup-screen')
    },

    // Open Mentors Signup Screen
    openMentorSignupScreen: function () {
        app.popup.close('#my-login-register-screen')
        app.popup.open('#mentor-signup-screen')
    },

    // This Section For Send Message Prompt
    sendMessagePrompt: function (mentorId) {
        app.dialog.prompt('Enter your Query Here', function (name) {
            if (name != "") {
                $.ajax({
                    type: "post",
                    url: url + "submitQuery",
                    data: { mentorId: mentorId, message: name, userId: userId },
                    dataType: "json"
                }).done(function (rply) {
                    if (rply.success) {
                        app.dialog.alert('Your query submit successfully')
                    }
                })
            }
        })
    },

    // Unblock User
    unblockUser: function () {
        app.dialog.confirm('Unblock <strong>Saikat Bhadury</strong>?', function () {
            app.dialog.alert('Unblocked!')
        })
    },

    // This Section For Sign-Up as Student
    studentSignup: function () {
        let studentPhone = $('#txtSPhone').val()
        let studentemail = $('#txtSRegisterEmail').val()


        if (studentPhone != "" && studentemail != "") {
            $.ajax({
                type: "post",
                url: url + 'mobileVerification',
                data: { studentPhone: studentPhone, studentemail: studentemail },
                dataType: "json",
            }).done(function (rply) {
                if (!rply.success) {
                    let toastCenter = app.toast.create({
                        text: 'Email or Mobile number already exist',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()



                }
                else {
                    // Bind Information Here [Class,Subject,Days,Time,Langeage]

                    // class
                    let classData = ''
                    classData += '<option value="" seleced hidden>Select Class</option>'
                    for (list in rply.class) {
                        classData += `<option value="${rply.class[list].class_id}">${rply.class[list].class}</option>`
                        $('#ddlStudentClass').html(classData)
                    }


                    // Subject 
                    let subject = ''
                    subject += '<option value="" seleced hidden>Select Subject</option>'
                    for (list in rply.subject) {
                        subject += `<option value="${rply.subject[list].subject_id}">${rply.subject[list].subject}</option>`
                        $('#ddlStudentSubject1').html(subject)
                        $('#ddlStudentSubject2').html(subject)
                        $('#ddlStudentSubject3').html(subject)
                        $('#ddlStudentSubject4').html(subject)
                    }



                    // Days 
                    let dayPreferance = ''
                    dayPreferance += '<option value="" seleced hidden>Select Day</option>'
                    for (list in rply.days) {
                        dayPreferance += `<option value="${rply.days[list].day}">${rply.days[list].day}</option>`
                        $('#ddlStudentDayPreferance').html(dayPreferance)
                    }


                    // Time 
                    let timePreferance = ''
                    timePreferance += '<option value="" seleced hidden>Select Time</option>'
                    for (list in rply.time) {
                        timePreferance += `<option value="${rply.time[list]}">${rply.time[list]}</option>`
                        $('#ddlStudentTimePreferance').html(timePreferance)
                    }

                    // Language 
                    let languagePreferance = ''
                    languagePreferance += '<option value="" seleced hidden>Select Language</option>'
                    for (list in rply.language) {
                        languagePreferance += `<option value="${rply.language[list].language_name}">${rply.language[list].language_name}</option>`
                        $('#ddlStudentLanguage').html(languagePreferance)
                    }

                    app.dialog.password('Enter your OTP', function (password) {
                        if (password == "") {
                            openOTPdialog()
                        }
                        else {
                            if (password == rply.otp) {
                                // Login Success Go For Next Stape
                                app.popup.close('#student-signup-screen')
                                app.popup.open('#student-signup-stape1')
                            }
                            else {
                                let toastCenter = app.toast.create({
                                    text: 'OTP not Match',
                                    position: 'center',
                                    closeTimeout: 2000,
                                })
                                toastCenter.open()
                            }
                        }
                    })
                }
            })
        }
        else {
            var toastCenter = app.toast.create({
                text: 'Validation Error',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },

    studentSignupStape2: function () {
        let studentName = $('#txtStudentName').val()
        let studentDOB = $('#txtStudentDateOfBirth').val()
        let studentGender = $('#ddlGender').val()
        let studentAddress = $('#txtStudentAddress').val()
        let studentPin = $('#txtStudentPinCode').val()
        let studentGname = $('#txtGurdianName').val()
        let studentGphone = $('#txtGurdianPhone').val()

        if (studentName != "" && studentDOB != "" && studentGender != "" && studentAddress != "" && studentPin != "" && studentGname != "" && studentGphone != "") {
            app.popup.close('#student-signup-stape1')
            app.popup.open('#student-signup-stape2')
        }
        else {
            let toastCenter = app.toast.create({
                text: 'Please Enter All Data',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }


    },


    // Register Student
    registerStudentComplete: function () {
        let studentPhone = $('#txtSPhone').val()
        let studentEmail = $('#txtSRegisterEmail').val()
        let studentName = $('#txtStudentName').val()
        let studentDOB = $('#txtStudentDateOfBirth').val()
        let studentGender = $('#ddlGender').val()
        let studentAddress = $('#txtStudentAddress').val()
        let studentPin = $('#txtStudentPinCode').val()
        let studentGname = $('#txtGurdianName').val()
        let studentGphone = $('#txtGurdianPhone').val()

        let studentSchool = $('#txtStudentSchoolName').val()
        let studentClass = $('#ddlStudentClass').val()
        let studentBoard = $('#txtBoardName').val()
        let studentSubject1 = $('#ddlStudentSubject1').val()
        let studentSubject2 = $('#ddlStudentSubject2').val()
        let studentSubject3 = $('#ddlStudentSubject3').val()
        let studentSubject4 = $('#ddlStudentSubject4').val()

        let studentArea = $('#autocomplete-dropdown-ajax').val()
        // let studentDay = $('#ddlStudentDayPreferance').val()
        // let studentTime = $('#ddlStudentTimePreferance').val()
        let studentLanguage = $('#ddlStudentLanguage').val()

        if (studentSchool != "" && studentClass != "" && studentBoard != "" && studentSubject1 != "" && studentSubject2 != "" && studentSubject3 != "" && studentLanguage != "" && studentArea != "" ) {
            $.ajax({
                type: "post",
                url: url + "saveStudent",
                data: { studentPhone: studentPhone, studentEmail: studentEmail, studentName: studentName, studentDOB: studentDOB, studentGender: studentGender, studentAddress: studentAddress, studentPin: studentPin, studentGname: studentGname, studentGphone: studentGphone, studentSchool: studentSchool, studentClass: studentClass, studentBoard: studentBoard, studentSubject1: studentSubject1, studentSubject2: studentSubject2, studentSubject3: studentSubject3, studentSubject4: studentSubject4, studentLanguage: studentLanguage, studentArea: studentArea },
                dataType: "json"
            }).done(function (rply) {
                user = studentPhone
                localStorage.setItem('gurusikshauser', user)
                localStorage.setItem('userId', rply.last_id)
                localStorage.setItem('userImage', 'img/user.jpg')
                localStorage.setItem('userType', 'S')
                app.popup.close('#student-signup-stape2')
                phonegapApp.studentTimeline()
                phonegapApp.studentMentors()
                phonegapApp.userDetails(user)
                window.location.href = "index.html"
            })
        }
        else {
            let toastCenter = app.toast.create({
                text: 'Please Enter All Data',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },


    // This Funcrtion For Student Signup
    openSLogin: function () {
        app.popup.close('#my-login-register-screen')
        app.popup.open('#my-login-screen-student-login')
    },

    // This Function For Open Student Forgot Student Id Screen
    openForgotStudentIdScreen: function () {
        app.popup.open('#forgot-studentid-screen')
        app.popup.close('#my-login-screen-student-login')

    },

    // This Function For Verify Mobile Student Or Gardians
    verifyStudentMobile: function () {
        if (!$('#txtMobileNumberForgot').val()) {
            let toastCenter = app.toast.create({
                text: 'Enter Mobile Number',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }
        $.ajax({
            type: "post",
            url: url + "verifyStudentMobile",
            data: { mobile: $('#txtMobileNumberForgot').val() },
            dataType: "json"
        }).done((rply) => {
            app.dialog.password('Enter your OTP', function (password) {
                if (password == "") {
                    openOTPdialog()
                }
                else {
                    if (password == rply.otp) {
                        // Send Recovery Email 
                        $.ajax({
                            type: "post",
                            url: url + "sendStudentId",
                            data: { email: rply.listStudnt[0].email, studentId: rply.listStudnt[0].student_generated_id, name: rply.listStudnt[0].name },
                            dataType: "json",
                        }).done((rply) => {
                            var toastCenter = app.toast.create({
                                text: 'Please Check your mailbox for get recover your Student-Id',
                                position: 'center',
                                closeTimeout: 2000,
                            })
                            toastCenter.open()
                        })
                    }
                    else {
                        var toastCenter = app.toast.create({
                            text: 'OTP not valid, Try again',
                            position: 'center',
                            closeTimeout: 2000,
                        })
                        toastCenter.open()
                    }
                }
            })
        })
    },


    // This Section For Student Login
    studentLogin: function () {
        let studentId = $('#txtStudentId').val();
        if (studentId) {
            if(studentId == "GURUSIKSHA003"){
                $.ajax({
                    type: "post",
                    url: url + "studentLogin",
                    data: { studentId: studentId },
                    dataType: "json"
                }).done((rply) => {
                    if (rply.success) {
                        app.dialog.password('Enter your OTP', function (password) {
                            if (password == "") {
                                openOTPdialog()
                            }
                            else {
                                if (password == "8583") {
                                    switch (rply.utype) {
                                        case 'M':
                                            localStorage.setItem('userId', rply.userDetails[0].mentor_id)
                                            userId = rply.userDetails[0].mentor_id
                                            if (!rply.userDetails[0].photo) {
                                                localStorage.setItem('userImage', 'img/user.png')
                                            }
                                            else {
                                                localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                            }
                                            phonegapApp.mentorTimeline()
                                            localStorage.setItem('userType', 'M')
                                            break
                                        case 'S':
    
                                            localStorage.setItem('userId', rply.userDetails[0].student_id)
                                            userId = rply.userDetails[0].student_id
                                            if (!rply.userDetails[0].photo) {
                                                localStorage.setItem('userImage', 'img/user.png')
                                            }
                                            else {
                                                localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                            }
                                            phonegapApp.studentTimeline()
                                            phonegapApp.studentMentors()
                                            localStorage.setItem('userType', 'S')
                                            break
    
                                        case 'G':
                                            localStorage.setItem('userId', rply.userDetails[0].guardian_id)
    
                                            if (!rply.userDetails[0].photo) {
                                                localStorage.setItem('userImage', 'img/user.png')
                                            }
                                            else {
                                                localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/guardians/' + rply.userDetails[0].photo)
                                            }
                                            userId = rply.userDetails[0].guardian_id
                                            phonegapApp.guardianTimeline()
                                            localStorage.setItem('userType', 'G')
                                            break
    
                                        default:
                                            break
                                    }
    
                                    localStorage.setItem('gurusikshauser', rply.userDetails[0].mobile)
                                    user = rply.userDetails[0].mobile
                                    localStorage.setItem('userType', rply.utype)
                                    phonegapApp.userDetails((rply.userDetails[0].mobile))
                                    app.popup.close('#my-login-screen-student-login')
                                    // phonegapApp.userDetails($('#txtMobileNumber').val())
                                    window.location.href="index.html"
                                }
                                else {
                                    var toastCenter = app.toast.create({
                                        text: 'OTP not valid, Try again',
                                        position: 'center',
                                        closeTimeout: 2000,
                                    })
                                    toastCenter.open()
                                }
                            }
                        })
                    }
                    else {
                        var toastCenter = app.toast.create({
                            text: 'Your number dose\'t exist. please signup',
                            position: 'center',
                            closeTimeout: 2000,
                        })
                        toastCenter.open()
                    }
                    // localStorage.setItem('userId', rply.userDetails[0].student_id)
                    // userId = rply.userDetails[0].student_id
                    // if (!rply.userDetails[0].photo) {
                    //     localStorage.setItem('userImage', 'img/user.png')
                    // }
                    // else {
                    //     localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                    // }
                    // localStorage.setItem('userType', 'S')
                    // phonegapApp.studentTimeline()
                    // phonegapApp.studentMentors()
                    // phonegapApp.userDetails(rply.userDetails[0].mobile)
                })

                return
            }
            
            $.ajax({
                type: "post",
                url: url + "studentLogin",
                data: { studentId: studentId },
                dataType: "json"
            }).done((rply) => {
                if (rply.success) {
                    app.dialog.password('Enter your OTP', function (password) {
                        if (password == "") {
                            openOTPdialog()
                        }
                        else {
                            if (password == rply.otp) {
                                switch (rply.utype) {
                                    case 'M':
                                        localStorage.setItem('userId', rply.userDetails[0].mentor_id)
                                        userId = rply.userDetails[0].mentor_id
                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                        }
                                        phonegapApp.mentorTimeline()
                                        localStorage.setItem('userType', 'M')
                                        break
                                    case 'S':

                                        localStorage.setItem('userId', rply.userDetails[0].student_id)
                                        userId = rply.userDetails[0].student_id
                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                        }
                                        phonegapApp.studentTimeline()
                                        phonegapApp.studentMentors()
                                        localStorage.setItem('userType', 'S')
                                        break

                                    case 'G':
                                        localStorage.setItem('userId', rply.userDetails[0].guardian_id)

                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/guardians/' + rply.userDetails[0].photo)
                                        }
                                        userId = rply.userDetails[0].guardian_id
                                        phonegapApp.guardianTimeline()
                                        localStorage.setItem('userType', 'G')
                                        break

                                    default:
                                        break
                                }

                                localStorage.setItem('gurusikshauser', rply.userDetails[0].mobile)
                                user = rply.userDetails[0].mobile
                                localStorage.setItem('userType', rply.utype)
                                phonegapApp.userDetails((rply.userDetails[0].mobile))
                                app.popup.close('#my-login-screen-student-login')
                                // phonegapApp.userDetails($('#txtMobileNumber').val())
                                window.location.href="index.html"
                            }
                            else {
                                var toastCenter = app.toast.create({
                                    text: 'OTP not valid, Try again',
                                    position: 'center',
                                    closeTimeout: 2000,
                                })
                                toastCenter.open()
                            }
                        }
                    })
                }
                else {
                    var toastCenter = app.toast.create({
                        text: 'Your number dose\'t exist. please signup',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                }
                // localStorage.setItem('userId', rply.userDetails[0].student_id)
                // userId = rply.userDetails[0].student_id
                // if (!rply.userDetails[0].photo) {
                //     localStorage.setItem('userImage', 'img/user.png')
                // }
                // else {
                //     localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                // }
                // localStorage.setItem('userType', 'S')
                // phonegapApp.studentTimeline()
                // phonegapApp.studentMentors()
                // phonegapApp.userDetails(rply.userDetails[0].mobile)
            })
        }
        else {
            let toastCenter = app.toast.create({
                text: 'Enter Student Id',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },

    // This Section For Apply Filter 
    applyFilter : function(){

    },

    // This Section For Gurdian Sign Up
    gurdiansSignup: function () {
        let gName = $('#txtGRegisterName').val()
        let gPhone = $('#txtGPhone').val()
        let gEmail = $('#txtGEmail').val()
        let gAddress = $('#txtGAddress').val()
        let gRelation = $('#txtGRelation').val()
        let gGender = $('#ddlGGender').val()
        let gPin = $('#txtGpin').val()
        let gStudentId = $('#txtGStudentId').val()
        let gArea = $('#autocomplete-dropdown-ajax-typeahead-gurdians').val()

        if (gName != "" && gPhone != "" && gEmail != "" && gAddress != "" && gRelation != "" && gGender != "" && gPin != "" && gStudentId != "") {
            $.ajax({
                type: "post",
                url: url + "mobileVerificationG",
                data: { gPhone: gPhone, gEmail: gEmail },
                dataType: "json"
            }).done(function (rply) {
                if (rply.success) {
                    app.dialog.password('Enter your OTP', function (password) {
                        if (password == "") {
                            openOTPdialog()
                        }
                        else {
                            if (password == rply.otp) {
                                $.ajax({
                                    type: "post",
                                    url: url + "saveGuardian",
                                    data: { gName: gName, gPhone: gPhone, gEmail: gEmail, gAddress: gAddress, gRelation: gRelation, gGender: gGender, gPin: gPin, gStudentId: gStudentId, gArea: gArea },
                                    dataType: "json"
                                }).done(function (rply) {
                                    user = gPhone
                                    localStorage.setItem('userId', rply.last_id)
                                    localStorage.setItem('gurusikshauser', user)
                                    localStorage.setItem('userImage', 'img/user.jpg')
                                    localStorage.setItem('userType', 'G')
                                    app.popup.close('#gurdians-signup-screen')
                                    phonegapApp.userDetails(user)
                                    window.location.href = "index.html"
                                })
                            }
                            else {
                                let toastCenter = app.toast.create({
                                    text: 'OTP not Match',
                                    position: 'center',
                                    closeTimeout: 2000,
                                })
                                toastCenter.open()
                            }
                        }
                    })
                }
                else {
                    let toastCenter = app.toast.create({
                        text: 'Email or Phonenumber already exist',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                }
            })
        }
        else {
            let toastCenter = app.toast.create({
                text: 'Please Enter All Data',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },

    // Mentor Sign Up Stape 1
    mentorSignup: function () {
        let mentorPhone = $('#txtMPhone').val()
        let mentoremail = $('#txtMRegisterEmail').val()


        if (app.input.validate('#txtMPhone') && app.input.validate('#txtMRegisterEmail')) {
            var toastCenter = app.toast.create({
                text: 'Validation Error',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }
        $.ajax({
            type: "post",
            url: url + 'mobileVerificationM',
            data: { mentorPhone: mentorPhone, mentoremail: mentoremail },
            dataType: "json",
        }).done(function (rply) {
            if (!rply.success) {
                app.input.validate('#txtMPhone')
                app.input.validate('#txtMRegisterEmail')
                let toastCenter = app.toast.create({
                    text: 'Email or Mobile number already exist',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
            }
            else {
                // Bind Information Here [Class,Subject,Days,Time,Langeage]




                // Subject 
                let subject = ''
                subject += '<option value="" seleced hidden>Select Subject</option>'
                for (list in rply.subject) {
                    subject += `<option value="${rply.subject[list].subject_id}">${rply.subject[list].subject}</option>`
                    $('#ddlMentorSubject1').html(subject)
                    $('#ddlMentorSubject2').html(subject)
                    $('#ddlMentorSubject3').html(subject)
                    $('#ddlMentorSubject4').html(subject)
                }



                // Days 
                let dayPreferance = ''
                dayPreferance += '<option value="" seleced hidden>Select Day</option>'
                for (list in rply.days) {
                    dayPreferance += `<option value="${rply.days[list].day}">${rply.days[list].day}</option>`
                    $('#ddlMentorDayPreferance').html(dayPreferance)
                }


                // Time 
                let timePreferance = ''
                timePreferance += '<option value="" seleced hidden>Select Time</option>'
                for (list in rply.time) {
                    timePreferance += `<option value="${rply.time[list]}">${rply.time[list]}</option>`
                    $('#ddlSMentorTimePreferance').html(timePreferance)
                }

                // Language 
                let languagePreferance = ''
                languagePreferance += '<option value="" seleced hidden>Select Language</option>'
                for (list in rply.language) {
                    languagePreferance += `<option value="${rply.language[list].language_name}">${rply.language[list].language_name}</option>`
                    $('#ddlMentorLanguage').html(languagePreferance)
                }

                app.dialog.password('Enter your OTP', function (password) {
                    if (password == "") {
                        openOTPdialog()
                    }
                    else {
                        if (password == rply.otp) {
                            // Login Success Go For Next Stape
                            app.popup.close('#mentor-signup-screen')
                            app.popup.open('#mentor-signup-screen-step2')
                        }
                        else {
                            let toastCenter = app.toast.create({
                                text: 'OTP not Match',
                                position: 'center',
                                closeTimeout: 2000,
                            })
                            toastCenter.open()
                        }
                    }
                })
            }
        })
    },

    // Mentor Signup Stape 2
    mentorSignupStape3: function () {
        // let mentorName = $('#txtMentorName').val()
        // let mentorDOB = $('#txtMentorDateOfBirth').val()
        // let mentorGender = $('#ddlMentorGender').val()
        // let mentorAddress = $('#txtMentorAddress').val()
        // let mentorPin = $('#txtMentorPinCode').val()
        if (app.input.validate('#txtMentorName') && app.input.validate('#txtMentorDateOfBirth') && app.input.validate('#ddlMentorGender') && app.input.validate('#txtMentorAddress') && app.input.validate('#txtMentorPinCode')) {
            let toastCenter = app.toast.create({
                text: 'Please Enter All Data',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }
        app.popup.close('#mentor-signup-screen-step2')
        app.popup.open('#mentor-signup-screen-step3')

    },


    // Register Mentor
    registerMentorComplete: function () {
        let mentorPhone = $('#txtMPhone').val()
        let mentorEmail = $('#txtMRegisterEmail').val()
        let mentorName = $('#txtMentorName').val()
        let mentorDOB = $('#txtMentorDateOfBirth').val()
        let mentorGender = $('#ddlMentorGender').val()
        let mentorAddress = $('#txtMentorAddress').val()
        let mentorPin = $('#txtMentorPinCode').val()

        let mentorAbout = $('#txtAboutYourSelf').val()
        let mentorSchool = $('#txtAssociatedSchool').val()
        let mentorAchievment = $('#txtAchievment').val()
        let mentorSubject1 = $('#ddlMentorSubject1').val()
        let mentorSubject2 = $('#ddlMentorSubject2').val()
        let mentorSubject3 = $('#ddlMentorSubject3').val()
        let mentorSubject4 = $('#ddlMentorSubject4').val()
        let mentorDay = $('#ddlMentorDayPreferance').val()
        let mentorTime = $('#ddlSMentorTimePreferance').val()
        let mentorLanguage = $('#ddlMentorLanguage').val()
        let mentorQualification = $('#txtQualification').val()
        let mentorExperience = $('#txtExperience').val()
        let mentorArea = $('#autocomplete-dropdown-ajax-typeahead-mentor').val()
        let teachingType = $('#ddlMentorTeachType').val()

        if (app.input.validate('#txtAboutYourSelf') && app.input.validate('#txtAchievment') && app.input.validate('#ddlMentorSubject1') && app.input.validate('#ddlMentorSubject2') && app.input.validate('#ddlMentorSubject3') && app.input.validate('#ddlMentorLanguage') && app.input.validate('#txtQualification') && app.input.validate('#txtExperience') && app.input.validate('#ddlMentorTeachType')){
            let toastCenter = app.toast.create({
                text: 'Please Enter All Mandatory Fields',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }
        $.ajax({
            type: "post",
            url: url + "saveMentor",
            data: { mentorPhone: mentorPhone, mentorEmail: mentorEmail, mentorName: mentorName, mentorDOB: mentorDOB, mentorGender: mentorGender, mentorAddress: mentorAddress, mentorPin: mentorPin, mentorAbout: mentorAbout, mentorSchool: mentorSchool, mentorAchievment: mentorAchievment, mentorSubject1: mentorSubject1, mentorSubject2: mentorSubject2, mentorSubject3: mentorSubject3, mentorSubject4: mentorSubject4, mentorDay: mentorDay, mentorTime: mentorTime, mentorLanguage: mentorLanguage, mentorQualification: mentorQualification, mentorExperience: mentorExperience, mentorArea: mentorArea, teachingType: teachingType },
            dataType: "json"
        }).done(function (rply) {
            user = mentorPhone
            localStorage.setItem('gurusikshauser', user)
            localStorage.setItem('userImage', 'img/user.jpg')
            localStorage.setItem('userType', 'M')
            localStorage.setItem('userId', rply.last_id)
            app.popup.close('#mentor-signup-screen-step3')

            phonegapApp.mentorTimeline()
            phonegapApp.userDetails(user)
            window.location.href = "index.html"

        })
        
    },


    // This Section For Login User
    login: function () {
        if ($('#txtMobileNumber').val() != "") {
            $.ajax({
                type: "post",
                url: url + "login",
                data: { mobile: $('#txtMobileNumber').val() },
                dataType: "json"
            }).done(function (rply) {
                if (rply.success) {
                    app.dialog.password('Enter your OTP', function (password) {
                        if (password == "") {
                            openOTPdialog()
                        }
                        else {
                            if (password == rply.otp) {
                                switch (rply.utype) {
                                    case 'M':
                                        localStorage.setItem('userId', rply.userDetails[0].mentor_id)
                                        userId = rply.userDetails[0].mentor_id
                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                        }
                                        phonegapApp.mentorTimeline()
                                        localStorage.setItem('userType', 'M')
                                        break
                                    case 'S':

                                        localStorage.setItem('userId', rply.userDetails[0].student_id)
                                        userId = rply.userDetails[0].student_id
                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                        }
                                        phonegapApp.studentTimeline()
                                        phonegapApp.studentMentors()
                                        localStorage.setItem('userType', 'S')
                                        break

                                    case 'G':
                                        localStorage.setItem('userId', rply.userDetails[0].guardian_id)

                                        if (!rply.userDetails[0].photo) {
                                            localStorage.setItem('userImage', 'img/user.png')
                                        }
                                        else {
                                            localStorage.setItem('userImage', 'http://guru-siksha.com/uploads/guardians/' + rply.userDetails[0].photo)
                                        }
                                        userId = rply.userDetails[0].guardian_id
                                        phonegapApp.guardianTimeline()
                                        localStorage.setItem('userType', 'G')
                                        break

                                    default:
                                        break
                                }

                                localStorage.setItem('gurusikshauser', $('#txtMobileNumber').val())
                                user = $('#txtMobileNumber').val()
                                localStorage.setItem('userType', rply.utype)
                                phonegapApp.userDetails($('#txtMobileNumber').val())
                                app.popup.close('#my-login-screen')
                                phonegapApp.userDetails($('#txtMobileNumber').val())
                                window.location.href="index.html"
                            }
                            else {
                                var toastCenter = app.toast.create({
                                    text: 'OTP not valid, Try again',
                                    position: 'center',
                                    closeTimeout: 2000,
                                })
                                toastCenter.open()
                            }
                        }
                    })
                }
                else {
                    var toastCenter = app.toast.create({
                        text: 'Your number dose\'t exist. please signup',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                }
            })
        }
    },


    // This Section For Get User Details
    userDetails: function (mobile) {
        var postCount = 0
        try{
            FCMPlugin.getToken(function (token) {
                $.ajax({
                    type: "post",
                    url: url + "getUserData",
                    data: { mobile: mobile, token: token, deviceId: device.uuid, userType: localStorage.getItem('userType') },
                    dataType: "JSON"
                }).done(function (rply) {
                    // console.log(rply.postsDtl.length)
                    if (rply.postsDtl.length < 4) {
                        $$('.infinite-scroll-preloader-profile').remove()
                        if (rply.postsDtl.length == 0) {
                            $('#lblOwnPost').html('<p class="text-align-center"><b>No Posts Yet</b></p>');
                        }
                    }
                    let ownPost = ''
                    switch (rply.utype) {
                        // If User Type Is Mentor Then This Block Will Execute
                        case 'M':
                            $('#lblpanelUserName').html(rply.userDetails[0].mentor_name)
                            $('#lblLougoutName').html(rply.userDetails[0].mentor_name)
                            $('#lblLogoutLink').html(rply.userDetails[0].mentor_name)
                            $('#lblUserName').html(rply.userDetails[0].mentor_name)
                            $('#lblUserBio').html(rply.userDetails[0].about)
                            $('#lblAchivment').html(rply.userDetails[0].achievements)
                            $('#lblAchivment').append('<br>' + rply.userDetails[0].mentor_qualification)
                            $('#lblAchivment').append('<br>' + rply.userDetails[0].mentor_experience)
                            $('#lblAchivment').append('<br> Teaching Subjects' + rply.userDetails[0].mentor_experience)
                            $('#lblPostsCount').html(rply.posts)
                            $('#lblFollowing').html(rply.followings)
                            $('#lblFollowers').html(rply.followers)
                            $('#editProfle').attr('href', '/edit-profile-mentor/')
                            $('#userNameOnPostPage').html(rply.userDetails[0].mentor_name)
                            if (rply.userDetails[0].photo) {
                                $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                                userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                            }
                            else {
                                $('#lblUserImage').attr('src', 'img/user.jpg')
                                $('#editMentorPhoto').attr('src', 'img/user.jpg')
                                $('#userImagePostPage').attr('src', 'img/user.jpg')
                                $('#userImageLogout').attr('src', 'img/user.jpg')

                                userImage = 'img/user.jpg'
                            }
                            // Edit Data
                            $('#editMentorname').val(rply.userDetails[0].mentor_name)
                            $('#editDateOfBirth').val(rply.userDetails[0].mentor_dob)
                            $('#editMentorAddress').html(rply.userDetails[0].mentor_address)
                            $('#editMentorPin').val(rply.userDetails[0].mentor_pin)
                            $('#editMentorAchivment').val(rply.userDetails[0].achievements)
                            $('#editQualification').val(rply.userDetails[0].mentor_qualification)
                            $('#editExperience').val(rply.userDetails[0].mentor_experience)

                            // This Section For Own Post
                            
                            for (list in rply.postsDtl) {
                                ownPost += '<div class="card demo-facebook-card">'
                                ownPost += '<div class="card-header">'
                                ownPost += `<div class="demo-facebook-avatar"><img src="${userImage}" width="34" height="34" style="border-radius: 50%" /></div>`
                                ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].mentor_name}</div>`
                                ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                                ownPost += `</div>`
                                ownPost += `<div class="card-content card-content-padding">`
                                ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                                ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`

                                if (rply.postsDtl[list].postdtl.file_type != "pdf") {
                                    if (rply.postsDtl[list].postdtl.post_image) {
                                        ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                                    }
                                }
                                else {
                                    ownPost += `<img src="img/pdf.png" width="25%"  />`
                                }


                                ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp&nbsp Comments: ${rply.postsDtl[list].postCmnt}</div>`
                                ownPost += `</a>`
                                ownPost += `</div>`
                                ownPost += `<div class="card-footer">`
                                if (rply.postsDtl[list].plike == 1) {
                                    ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                                }
                                else {
                                    ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                                }
                                ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                                if (rply.postsDtl[list].postdtl.post_image && rply.postsDtl[list].postdtl.file_type != "youtube") {
                                    ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}', 'http://guru-siksha.com//posts/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                }
                                else {
                                    ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                }

                                ownPost += `</div>`
                                ownPost += `</div>`
                                postCount = parseInt(postCount) + 1
                                $('#lblOwnPost').html(ownPost)
                            }

                            if (rply.postsDtl.length < 4) {
                                $('#lblLoaderForOwnPost').hide()
                                if (rply.postsDtl.length == 0) {
                                    $('#lblOwnPost').html('<p class="text-align-center"><b>No Posts Yet</b></p>');
                                }
                            }




                            // Menus
                            $('#menuClassTimeTable').show()
                            $('#menuSaveContent').show()
                            $('#menuStudentList').show()
                            $('#menuSettings').show()
                            $('#menuSendAssignmentMentor').show()
                            $('#mentorWishToRelocate').show()
                            $('#mentorSubjectList').show()
                            $('#mentorBoardAndClass').show()
                            break

                        case 'S':
                            $('#lblpanelUserName').html(rply.userDetails[0].name)
                            $('#lblLougoutName').html(rply.userDetails[0].name)
                            $('#lblLogoutLink').html(rply.userDetails[0].name)
                            $('#lblUserName').html(rply.userDetails[0].name)
                            $('#lblUserBio').html(rply.userDetails[0].school)

                            $('#editProfle').attr('href', '/edit-profile-mentor/')
                            $('#studentFolowers').html('Saved Post');
                            $('#lblFollowers').html(rply.followers)
                            $('#lblFollowing').html(rply.followings)
                            $('#lblPostsCount').html(rply.posts)

                            if (rply.userDetails[0].photo) {
                                $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                                userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                            }
                            else {
                                $('#lblUserImage').attr('src', 'img/user.jpg')
                                $('#editMentorPhoto').attr('src', 'img/user.jpg')
                                $('#userImagePostPage').attr('src', 'img/user.jpg')
                                $('#userImageLogout').attr('src', 'img/user.jpg')

                                userImage = 'img/user.jpg'
                            }

                            if (rply.postsDtl != "") {
                                for (list in rply.postsDtl) {
                                    ownPost += '<div class="card demo-facebook-card">'
                                    ownPost += '<div class="card-header">'
                                    ownPost += `<div class="demo-facebook-avatar"><img src="${userImage}" width="34" height="34" style="border-radius: 50%" /></div>`
                                    ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].name}</div>`
                                    ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                                    ownPost += `</div>`
                                    ownPost += `<div class="card-content card-content-padding">`
                                    ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                                    ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`

                                    if (rply.postsDtl[list].postdtl.file_type != "pdf") {
                                        if (rply.postsDtl[list].postdtl.post_image) {
                                            ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                                        }
                                    }
                                    else {
                                        ownPost += `<img src="img/pdf.png" width="25%"  />`
                                    }


                                    ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp;&nbsp; Comments: ${rply.postsDtl[list].postCmnt}</div>`
                                    ownPost += `</a>`
                                    ownPost += `</div>`
                                    ownPost += `<div class="card-footer">`
                                    if (rply.postsDtl[list].plike) {
                                        ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                                    }
                                    else {
                                        ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                                    }
                                    ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                                    if (rply.postsDtl[list].postdtl.post_image && rply.postsDtl[list].postdtl.file_type != "youtube") {
                                        ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}', 'http://gurusiksha://post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                    }
                                    else {
                                        ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://gurusiksha://post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                    }

                                    ownPost += `</div>`
                                    ownPost += `</div>`
                                    postCount = parseInt(postCount) + 1
                                    $('#lblOwnPost').html(ownPost)
                                }
                                
                                if (rply.postsDtl.length < 4) {
                                    console.log("Here")
                                    $('.infinite-scroll-preloader-profile').hide()
                                    if (rply.postsDtl.length == 0) {
                                        $('#lblOwnPost').html('<p class="text-align-center"><b>No Posts Yet</b></p>')
                                    }
                                }
                                
                                // if (postCount <= 5) {
                                //     $('#lblLoaderForOwnPost').hide()
                                // }
                                // else {
                                //     $('#lblLoaderForOwnPost').show()
                                // }
                            }

                            $('#userNameOnPostPage').html(rply.userDetails[0].name)
                            if (rply.userDetails[0].photo) {
                                $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                                $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                                userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                            }
                            else {
                                $('#lblUserImage').attr('src', 'img/user.jpg')
                                $('#editMentorPhoto').attr('src', 'img/user.jpg')
                                $('#userImagePostPage').attr('src', 'img/user.jpg')
                                $('#userImageLogout').attr('src', 'img/user.jpg')

                                userImage = 'img/user.jpg'
                            }


                            // Menus
                            $('#menuSpecialQuery').show()
                            $('#menuProgressReport').show()
                            $('#menuCurrentAssigment').show()
                            $('#menuSaveContent').show()
                            $('#menuClassDetails').show()
                            $('#menAssignMentor').hide()
                            $('#menuOfferSubject').show()
                            $('#menuAssignmentStudent').show()
                            $('#menuMentorRate').show()
                            $('#editProfle').attr('href', '/edit-profile-user/');



                            break

                        case 'G':
                            $('#lblpanelUserName').html(rply.userDetails[0].guardian_name)
                            $('#lblLougoutName').html(rply.userDetails[0].guardian_name)
                            $('#lblLogoutLink').html(rply.userDetails[0].guardian_name)
                            $('#lblUserName').html(rply.userDetails[0].guardian_name)
                            $('#lblUserBio').html(rply.userDetails[0].guardian_email)
                            userImage = 'img/user.jpg'
                            $('#userImageLogout').attr('src', userImage)
                            $('#editProfle').attr('href', '/edit-profile-mentor/')
                            $('#studentFolowers').hide();
                            $('#lblFollowers').hide()
                            $('#lblFollowing').hide()
                            $('#lblPostsCount').hide()
                            $('#lblLoaderForOwnPost').hide();
                            $('#your-post-content').hide();
                            $('#dvPostsCount').hide();
                            $('#dvFollowing').hide();
                            $('.infinite-scroll-preloader-profile').hide();

                            // Menues
                            $('#menuSpecialQuery').show()
                            $('#menuProgressReport').show()
                            $('#menuCurrentAssigment').show()
                            $('#menuSaveContent').show()
                            $('#menuClassDetails').show()
                            $('#menAssignMentor').hide()
                            $('#menuOfferSubject').show()
                            $('#menuAssignmentStudent').show()
                            $('#menuMentorRate').show()

                            break

                        default:
                            break
                    }
                    $('#lblChatCount').val(rply.chatCount)
                })
            })
        }
        catch(err){
            console.log(err)
        }   
        finally{
            $.ajax({
                type: "post",
                url: url + "getUserData",
                data: { mobile: mobile, token: '', deviceId: '', userType: localStorage.getItem('userType') },
                dataType: "JSON"
            }).done(function (rply) {
                
                if (rply.postsDtl.length < 4) {
                    $$('.infinite-scroll-preloader-profile').remove()
                    if (rply.postsDtl.length == 0) {
                        $('#lblOwnPost').html('<p class="text-align-center"><b>No Posts Yet</b></p>');
                    }
                }
                let ownPost = ''
                switch (rply.utype) {
                    // If User Type Is Mentor Then This Block Will Execute
                    case 'M':
                        $('#lblpanelUserName').html(rply.userDetails[0].mentor_name)
                        $('#lblLougoutName').html(rply.userDetails[0].mentor_name)
                        $('#lblLogoutLink').html(rply.userDetails[0].mentor_name)
                        $('#lblUserName').html(rply.userDetails[0].mentor_name)
                        $('#lblUserBio').html(rply.userDetails[0].about)
                        $('#lblAchivment').html(rply.userDetails[0].achievements)
                        $('#lblAchivment').append('<br>' + rply.userDetails[0].mentor_qualification)
                        $('#lblAchivment').append('<br>' + rply.userDetails[0].mentor_experience)
                        $('#lblAchivment').append('<br> Teaching Subjects' + rply.userDetails[0].mentor_experience)
                        $('#lblPostsCount').html(rply.posts)
                        $('#lblFollowing').html(rply.followings)
                        $('#lblFollowers').html(rply.followers)
                        $('#editProfle').attr('href', '/edit-profile-mentor/')
                        $('#userNameOnPostPage').html(rply.userDetails[0].mentor_name)
                        if (rply.userDetails[0].photo) {
                            $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                            userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                        }
                        else {
                            $('#lblUserImage').attr('src', 'img/user.jpg')
                            $('#editMentorPhoto').attr('src', 'img/user.jpg')
                            $('#userImagePostPage').attr('src', 'img/user.jpg')
                            $('#userImageLogout').attr('src', 'img/user.jpg')

                            userImage = 'img/user.jpg'
                        }
                        // Edit Data
                        $('#editMentorname').val(rply.userDetails[0].mentor_name)
                        $('#editDateOfBirth').val(rply.userDetails[0].mentor_dob)
                        $('#editMentorAddress').html(rply.userDetails[0].mentor_address)
                        $('#editMentorPin').val(rply.userDetails[0].mentor_pin)
                        $('#editMentorAchivment').val(rply.userDetails[0].achievements)
                        $('#editQualification').val(rply.userDetails[0].mentor_qualification)
                        $('#editExperience').val(rply.userDetails[0].mentor_experience)

                        // This Section For Own Post


                        for (list in rply.postsDtl) {
                            ownPost += '<div class="card demo-facebook-card">'
                            ownPost += '<div class="card-header">'
                            ownPost += `<div class="demo-facebook-avatar"><img src="${userImage}" width="34" height="34" style="border-radius: 50%" /></div>`
                            ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].mentor_name}</div>`
                            ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                            ownPost += `</div>`
                            ownPost += `<div class="card-content card-content-padding">`
                            ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                            ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`

                            if (rply.postsDtl[list].postdtl.file_type == "pdf") {

                                ownPost += `<img src="img/pdf.png" width="25%"  />`
                            }
                            else if(rply.postsDtl[list].postdtl.file_type == "image") {
                                ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                            }
                            else if (rply.postsDtl[list].postdtl.file_type == "youtube"){
                                ownPost += `<img src="${rply.postsDtl[list].postdtl.post_image}" width="100%" >`   
                            }


                            ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp&nbsp Comments: ${rply.postsDtl[list].postCmnt}</div>`
                            ownPost += `</a>`
                            ownPost += `</div>`
                            ownPost += `<div class="card-footer">`
                            if (rply.postsDtl[list].plike) {
                                ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                            }
                            else {
                                ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                            }
                            ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                            if (rply.postsDtl[list].postdtl.post_image && rply.postsDtl[list].postdtl.file_type != "youtube") {
                                ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}', 'http://guru-siksha.com//posts/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                            }
                            else {
                                ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                            }

                            ownPost += `</div>`
                            ownPost += `</div>`
                            postCount = parseInt(postCount) + 1
                            $('#lblOwnPost').html(ownPost)
                        }
                        console.log(rply.postsDtl.length)




                        // Menus
                        $('#menuClassTimeTable').show()
                        $('#menuSaveContent').show()
                        $('#menuStudentList').show()
                        $('#menuSettings').show()
                        $('#menuSendAssignmentMentor').show()
                        $('#mentorWishToRelocate').show()
                        $('#mentorSubjectList').show()
                        $('#mentorBoardAndClass').show()
                        break

                    case 'S':
                        $('#lblpanelUserName').html(rply.userDetails[0].name)
                        $('#lblLougoutName').html(rply.userDetails[0].name)
                        $('#lblLogoutLink').html(rply.userDetails[0].name)
                        $('#lblUserName').html(rply.userDetails[0].name)
                        $('#lblUserBio').html(rply.userDetails[0].school)

                        $('#editProfle').attr('href', '/edit-profile-mentor/')
                        $('#studentFolowers').html('Saved Post');
                        $('#lblFollowers').html(rply.followers)
                        $('#lblFollowing').html(rply.followings)
                        $('#lblPostsCount').html(rply.posts)

                        if (rply.userDetails[0].photo) {
                            $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                            userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                        }
                        else {
                            $('#lblUserImage').attr('src', 'img/user.jpg')
                            $('#editMentorPhoto').attr('src', 'img/user.jpg')
                            $('#userImagePostPage').attr('src', 'img/user.jpg')
                            $('#userImageLogout').attr('src', 'img/user.jpg')

                            userImage = 'img/user.jpg'
                        }

                        if (rply.postsDtl != "") {
                            for (list in rply.postsDtl) {
                                ownPost += '<div class="card demo-facebook-card">'
                                ownPost += '<div class="card-header">'
                                ownPost += `<div class="demo-facebook-avatar"><img src="${userImage}" width="34" height="34" style="border-radius: 50%" /></div>`
                                ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].name}</div>`
                                ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                                ownPost += `</div>`
                                ownPost += `<div class="card-content card-content-padding">`
                                ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                                ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`

                                if (rply.postsDtl[list].postdtl.file_type == "pdf") {

                                    ownPost += `<img src="img/pdf.png" width="25%"  />`
                                }
                                else if (rply.postsDtl[list].postdtl.file_type == "image") {
                                    ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                                }
                                else if (rply.postsDtl[list].postdtl.file_type == "youtube") {
                                    ownPost += `<img src="${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                                }


                                ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp;&nbsp; Comments: ${rply.postsDtl[list].postCmnt}</div>`
                                ownPost += `</a>`
                                ownPost += `</div>`
                                ownPost += `<div class="card-footer">`
                                if (rply.postsDtl[list].plike) {
                                    ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                                }
                                else {
                                    ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                                }
                                ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                                if (rply.postsDtl[list].postdtl.post_image && rply.postsDtl[list].postdtl.file_type != "youtube") {
                                    ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}', 'http://gurusiksha://post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                }
                                else {
                                    ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://gurusiksha://post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                                }

                                ownPost += `</div>`
                                ownPost += `</div>`
                                postCount = parseInt(postCount) + 1
                                $('#lblOwnPost').html(ownPost)
                            }
                            // if (postCount <= 5) {
                            //     $('#lblLoaderForOwnPost').hide()
                            // }
                            // else {
                            //     $('#lblLoaderForOwnPost').show()
                            // }
                        }
                        // else {
                        //     $('#lblLoaderForOwnPost').s()
                        // }

                        $('#userNameOnPostPage').html(rply.userDetails[0].name)
                        if (rply.userDetails[0].photo) {
                            $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImagePostPage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                            $('#userImageLogout').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)

                            userImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                        }
                        else {
                            $('#lblUserImage').attr('src', 'img/user.jpg')
                            $('#editMentorPhoto').attr('src', 'img/user.jpg')
                            $('#userImagePostPage').attr('src', 'img/user.jpg')
                            $('#userImageLogout').attr('src', 'img/user.jpg')

                            userImage = 'img/user.jpg'
                        }


                        // Menus
                        $('#menuSpecialQuery').show()
                        $('#menuProgressReport').show()
                        $('#menuCurrentAssigment').show()
                        $('#menuSaveContent').show()
                        $('#menuClassDetails').show()
                        $('#menAssignMentor').show()
                        $('#menuOfferSubject').show()
                        $('#menuAssignmentStudent').show()
                        $('#menuMentorRate').show()
                        $('#editProfle').attr('href', '/edit-profile-user/');



                        break

                    case 'G':
                        $('#lblpanelUserName').html(rply.userDetails[0].guardian_name)
                        $('#lblLougoutName').html(rply.userDetails[0].guardian_name)
                        $('#lblLogoutLink').html(rply.userDetails[0].guardian_name)
                        $('#lblUserName').html(rply.userDetails[0].guardian_name)
                        $('#lblUserBio').html(rply.userDetails[0].guardian_email)
                        userImage = 'img/user.jpg'
                        $('#userImageLogout').attr('src', userImage)
                        $('#editProfle').attr('href', '/edit-profile-mentor/')
                        $('#studentFolowers').hide();
                        $('#lblFollowers').hide()
                        $('#lblFollowing').hide()
                        $('#lblPostsCount').hide()
                        $('#lblLoaderForOwnPost').hide();
                        $('#your-post-content').hide();
                        $('#dvPostsCount').hide();
                        $('#dvFollowing').hide();
                        $('.infinite-scroll-preloader-profile').hide();

                        // Menues
                        $('#menuSpecialQuery').show()
                        $('#menuProgressReport').show()
                        $('#menuCurrentAssigment').show()
                        $('#menuSaveContent').show()
                        $('#menuClassDetails').show()
                        $('#menAssignMentor').show()
                        $('#menuOfferSubject').show()
                        $('#menuAssignmentStudent').show()
                        $('#menuMentorRate').show()

                        break

                    default:
                        break
                }
                $('#lblChatCount').val(rply.chatCount)
            })
        }
        
        
        phonegapApp.getNotification()
    },


    // This Function For Get area for mentor relocation
    mentorRelocation : function(){
        $.ajax({
            type: "post",
            url: url + "allLocation",
            data: {},
            dataType: "json"
        }).done((rply)=>{
            let areas = ''
            for(list in rply){
                areas += `<option value=${rply[list].sub_id}>${rply[list].title}</option>`
                $('#ddlWishToRelocate').html(areas)
            }
        })
    },

    // This Section For Get Mentor Selected Location
    mentorSelectedLocation : function() {
        $.ajax({
            type: "post",
            url: url + "getLocation",
            data: { userId: userId, userType: userType},
            dataType: "json"
        }).done((rply) => {
            let locationList = ''
            for (list in rply.locations){
                locationList += `<li><a href="#" onclick="phonegapApp.deleteMentorLocattion(${rply.locations[list].twid})" class="item-link item-content">`
                locationList += `<div class="item-inner">`
                locationList += `<div class="item-title"><strong>${rply.locations[list].title}</strong></div>`
                locationList += `<div class="item-after"><i class="material-icons md-only icon color-red">delete_forever</i></div>`
                locationList += `</div>`
                locationList += ` </a></li>`
                $('#listMentroLocation').html(locationList);
            }
            
            
        })
    },


    // This Function For Delete Location
    deleteMentorLocattion : function (id){
        $.ajax({
            type: "post",
            url: url + "deleteLocation",
            data: { wishId : id},
            dataType: "json"
        }).done((rply) =>{
            phonegapApp.mentorSelectedLocation()
        })
    },

    // This Section For Mentor Area Submit 
    submitAreaRelocation : function(){
        
        if ($('#ddlWishToRelocate').val().length !=0)
        {
            $.ajax({
                type: "post",
                url: url + "submitAreaRelocation",
                data: { userId: userId, locations: $('#ddlWishToRelocate').val() , userType : userType},
                dataType: "JSON"
            }).done((rply) => {
                let toastCenter = app.toast.create({
                    text: 'Location Set Successfully',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                $('#ddlWishToRelocate').val('')
                phonegapApp.mentorSelectedLocation()
            })
        }
        else{
            console.log('Empty')
        }
        
    },


    // This Section For Edit Profile Mertor
    updateMentorProfile: function () {
        if ($('#editMentorname').val() == "" && $('#editDateOfBirth').val() == "" && $('#editMentorAddress').val() == "" && $('#editMentorPin').val() == "" && $('#editMentorAchivment').val() == "" && $('#editQualification').val() == "" && $('#editExperience').val() == "") {
            var toastCenter = app.toast.create({
                text: 'All fields are mandetory',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
        else {
            $.ajax({
                type: "post",
                url: url + "updateMentorProfile",
                data: { name: $('#editMentorname').val(), dob: $('#editDateOfBirth').val(), address: $('#editMentorAddress').val(), qualification: $('#editQualification').val(), pin: $('#editMentorPin').val(), experience: $('#editExperience').val(), userId: userId },
                dataType: "json"
            }).done(function (rply) {
                if (rply.success) {
                    var toastCenter = app.toast.create({
                        text: 'Profile Update',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                    phonegapApp.userDetails(user)
                }
            })
        }
    },

    // This Function For Open Gallery
    openCamera: function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        })

    },

    // This Function For Open Gallery
    openGellery: function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        })
    },

    // This Section For Logout
    logout: function () {
        localStorage.clear()
        window.location.href = "index.html"
    },

    // Get Mentor Date And Time
    mentorSelectedSubject: function () {
        let subjects = ''
        let days = ''
        let times = ''
        let messageHistory = ''
        $.ajax({
            type: "post",
            url: url + "mentorsSubjectDayTime",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {

            subjects += `<option value="">Select Subject</option>`
            for (list in rply.subjects) {
                subjects += `<option value="${rply.subjects[list].subject_id}">${rply.subjects[list].subject}</option>`
                $('#selectSubjects').html(subjects)
            }
            days += `<option value="">Select Days</option>`
            for (list in rply.days) {
                days += `<option value="${rply.days[list].day_id}">${rply.days[list].day}</option>`
                $('#selectDaysTime').html(days)
            }
            times += `<option value="">Select Times</option>`
            for (list in rply.times) {
                times += `<option value="${rply.times[list].time_id}">${rply.times[list].timee}</option>`
                $('#selectTime').html(times)
            }

            // This Secction For Rutin History

            if (!rply.classSchedule.length) {
                messageHistory += '<p class="text-align-center">No Record Found</p>'
                $('#lblSeduleHistory').html(messageHistory)
                $('#listMentorTimeing').hide();
            }
            else {
                for (list in rply.classSchedule) {
                    messageHistory += '<li>'
                    messageHistory += `<a href="#" onclick="phonegapApp.deleteMentorTime(${rply.classSchedule[list].tech_time_id})" class="item-link item-content">`
                    messageHistory += '<div class="item-inner">'
                    messageHistory += `<div class="item-title"><strong>${rply.classSchedule[list].day}</strong> ${rply.classSchedule[list].pf_start_time} to ${rply.classSchedule[list].pf_end_time}</div>`
                    messageHistory += '<div class="item-after"><i class="material-icons md-only icon color-red">delete_forever</i></div>'
                    messageHistory += '</div>'
                    messageHistory += '</a>'
                    messageHistory += '</li>'
                    $('#listMentorTimeing').html(messageHistory)
                }
            }
        })
    },

    // This Section For Delete Mentor Time
    deleteMentorTime : function(id){
        app.dialog.confirm('Are you sure to delete?', function () {
            $.ajax({
                type: "post",
                url: url + "deleteMentorTime",
                data: { id: id },
                dataType: "json"
            }).done((rply) => {
                let toastCenter = app.toast.create({
                    text: 'Deleted',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                phonegapApp.mentorSelectedSubject()
            });
        });
       
    },

    // Submit Date And Time
    updateRutin: function () {
        
        if ($('#selectDays').val() != "" && ($('#startTime1').val() != "" || $('#startTime2').val() != "" || $('#startTime3').val() != "" || $('#startTime4').val() != "" || $('#endTime1').val() != "" || $('#endTime2').val() != "" || $('#endTime3').val() != "" || $('#endTime4').val() != "" )) {
            $.ajax({
                type: "post",
                url: url + "mentorsSubjectDayTimeUpdate",
                data: { days: $('#selectDaysTime').val(), startTime1: $('#startTime1').val(), endTime1: $('#endTime1').val(), startTime2: $('#startTime2').val(), endTime2: $('#endTime2').val(), startTime3: $('#startTime3').val(), endTime3: $('#endTime3').val(), startTime4: $('#startTime4').val(), endTime4: $('#endTime4').val(), userId: userId },
                dataType: "json"
            }).done(function (rply) {
                $('#selectDaysTime').val('')
                $('#startTime1').val('')
                $('#endTime1').val('')

                $('#startTime2').val('')
                $('#endTime2').val('')

                $('#startTime3').val('')
                $('#endTime3').val('')

                $('#startTime4').val('')
                $('#endTime4').val('')

                var toastCenter = app.toast.create({
                    text: 'Class time update',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                phonegapApp.mentorSelectedSubject()
            })
        }
        else {
            var toastCenter = app.toast.create({
                text: 'Validation Error',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }

    },

    // This Section For Post Change 
    postChange: function (val) {
        if (val.length > 0) {
            $('#btnShare').removeClass('disabled')
        }
        else {
            $('#btnShare').addClass('disabled')
        }
    },

    // Open Camera For Post Page
    openCameraPost() {
        navigator.camera.getPicture(onPostSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        })
    },

    // Open Camera For Post Page
    openGalleryPost() {
        navigator.camera.getPicture(onPostSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        })
    },

    // Delete Post Image
    deletePostImage: function () {
        app.dialog.confirm('Are you want to delete this image?', function () {
            $('#postImagePlace').hide()
            $('#deletePostImage').hide()
            app.dialog.alert('Deleted!')
            $('#txtPostImage').val('')
            $('#txtPostImagetype').val('')
        })
    },

    // Give a post
    mentorPost: function () {

        if ($('#txtPostImagetype').val() == "pdf") {
            let imageURI = $('#txtPostImage').val()
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "application/pdf";

            var params = new Object();
            params.type = "pdf";
            params.post = $('#txtMind').val();
            params.userType = userType;
            params.userId = userId;

            options.params = params;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(imageURI, url + "submitPost",
                function (result) {
                    var toastCenter = app.toast.create({
                        text: 'Post Update Successfully',
                        position: 'center',
                        closeTimeout: 5000,
                    })
                    toastCenter.open()
                    $('#postImagePlace').hide()
                    $('#deletePostImage').hide()
                    $('#txtPostImage').val('')
                    $('#txtPostImagetype').val('')
                    $('#txtMind').val('')
                },
                function (error) {
                }, options);
        }
        else if ($('#txtPostImagetype').val() == "Image") {
            $.ajax({
                type: "post",
                url: url + "submitPost",
                data: { img: $('#txtPostImage').val(), post: $('#txtMind').val(), userType: userType, userId: userId, type: 'image' },
                dataType: "JSON"
            }).done(function (rply) {
                if (rply.status) {
                    var toastCenter = app.toast.create({
                        text: 'Post Update Successfully',
                        position: 'center',
                        closeTimeout: 5000,
                    })
                    toastCenter.open()

                    $('#postImagePlace').hide()
                    $('#deletePostImage').hide()
                    $('#txtPostImage').val('')
                    $('#txtPostImagetype').val('')
                    $('#txtMind').val('')
                }
                else {

                }
            })
        }
        else if ($('#txtPostImagetype').val() == "youtube"){
            $.ajax({
                type: "post",
                url: url + "submitPost",
                data: { img: $('#txtPostImage').val(), post: $('#txtMind').val(), userType: userType, userId: userId, type: 'youtube', link: $('#txtYoutubeLink').val() },
                dataType: "JSON"
            }).done(function (rply) {
                if (rply.status) {
                    var toastCenter = app.toast.create({
                        text: 'Post Update Successfully',
                        position: 'center',
                        closeTimeout: 5000,
                    })
                    toastCenter.open()

                    $('#postImagePlace').hide()
                    $('#deletePostImage').hide()
                    $('#txtPostImage').val('')
                    $('#txtPostImagetype').val('')
                    $('#txtMind').val('')
                }
                else {

                }
            })
        }
        else{
            $.ajax({
                type: "post",
                url: url + "submitPost",
                data: { post: $('#txtMind').val(), userType: userType, userId: userId, type: '' },
                dataType: "JSON"
            }).done(function (rply) {
                if (rply.status) {
                    var toastCenter = app.toast.create({
                        text: 'Post Update Successfully',
                        position: 'center',
                        closeTimeout: 5000,
                    })
                    toastCenter.open()

                    $('#postImagePlace').hide()
                    $('#deletePostImage').hide()
                    $('#txtPostImage').val('')
                    $('#txtPostImagetype').val('')
                    $('#txtMind').val('')
                }
                else {

                }
            })
        }

    },

    // Mentor Next Posts
    mentorNextPosts: function () {
        $.ajax({
            type: "post",
            url: url + "getUserPostData",
            data: { mobile: user, postcount: postCount },
            dataType: "json"
        }).done(function (rply) {
            
            let ownPost = ''
            for (list in rply.postsDtl) {
                postCount = parseInt(postCount) + 1
                ownPost += '<div class="card demo-facebook-card">'
                ownPost += '<div class="card-header">'
                ownPost += `<div class="demo-facebook-avatar"><img src="http://guru-siksha.com/uploads/mentor/${rply.userDetails[0].photo}" width="34" height="34" style="border-radius: 50%" /></div>`
                ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].mentor_name}</div>`
                ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                ownPost += `</div>`
                ownPost += `<div class="card-content card-content-padding">`
                ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`
                // if (rply.postsDtl[list].postdtl.post_image) {
                //     ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" </div>`
                // }
                if (rply.postsDtl[list].postdtl.file_type != "pdf") {
                    if (rply.postsDtl[list].postdtl.post_image) {
                        ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                    }
                }
                else {
                    ownPost += `<img src="img/pdf.png" width="25%"  />`
                }
                ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp&nbsp Comments: ${rply.postsDtl[list].postCmnt}</div>`
                ownPost += `</a>`
                ownPost += `</div>`
                ownPost += `<div class="card-footer">`
                if (rply.postsDtl[list].plike) {
                    ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                }
                else {
                    ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                }
                ownPost += `<a href="#" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                ownPost += `<a href="#" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                ownPost += `</div>`
                ownPost += `</div>`
            }
            $('#lblOwnPost').append(ownPost)
        })
    },


    // This Function For Post Save
    postLike: function (postId, selector) {
        $.ajax({
            type: "post",
            url: url + "PostLike",
            data: { postId: postId, userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            $('#' + selector).html('<i class="icon material-icons color-red">star</i>')
            $('#' + selector).attr("onclick", "phonegapApp.postDislike(" + postId + ",'" + selector + "')")
        })
    },

    // This Section For Post Unsaved
    postDislike: function (postId, selector) {
        $.ajax({
            type: "post",
            url: url + "PostDisLike",
            data: { postId: postId, userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            $('#' + selector).html('<i class="icon material-icons" >star_border</i>')
            $('#' + selector).attr("onclick", "phonegapApp.postLike(" + postId + ",'" + selector + "')")
        })
    },

    // This Section For Post Details
    postDetails: function (postId) {
        $.ajax({
            type: "post",
            url: url + "PostDetails",
            data: { postId: postId, userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            console.log(rply)
            if (rply.pDetails[0].postdtl[0].user_type == "M") {
                console.log('I am mentor block')
                $('#lblpostUserName').html(rply.pDetails[0].postdtl[0].mentor_name);
                // $('#lblpostUserName').html(rply.pDetails[0].postdtl[0].name);
                if (rply.pDetails[0].postdtl[0].photo) {
                    $('#lblPostUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.pDetails[0].postdtl[0].photo)
                }
                else {
                    $('#lblPostUserImage').attr('src', 'img/user.png')
                }
                $('#lblPostContent').html(rply.pDetails[0].postdtl[0].post_content)
                if (rply.pDetails[0].postdtl[0].post_image)
                {
                    if (rply.pDetails[0].postdtl[0].file_type == "pdf") {
                        $('#lblPostContent').append('<br><br>');
                        $('#lblPostContent').append(`<img src="img/pdf.png" width="25%" onclick="
                    phonegapApp.openPDFupload('http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}');">`);
                    }
                    else if (rply.pDetails[0].postdtl[0].file_type == "youtube") {
                        $('#lblPostContent').append('<br><br>');

                        let youtubeVideoId = rply.pDetails[0].postdtl[0].youtube_link
                        youtubeVideoId = youtubeVideoId.split("/")
                        rply.pDetails[0].postdtl[0].youtube_link
                        $('#lblPostContent').append(`<img src="${rply.pDetails[0].postdtl[0].post_image}" width="25%" onclick="YoutubeVideoPlayer.openVideo('${youtubeVideoId[3]}')">`);
                    }
                    else if (rply.pDetails[0].postdtl[0].file_type == "image"){
                        $('#lblPostContent').append('<br><br>');
                    $('#lblPostContent').append(`<img src="http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}" width="100%" >`);
                    }
                
                }
                


            }
            else if (rply.pDetails[0].postdtl[0].user_type == "S") {
                console.log('I am student block')
                console.log("hii " + rply.pDetails[0].postdtl[0].photo)
                $('#lblpostUserName').html(rply.pDetails[0].postdtl[0].name);
                
                if (rply.pDetails[0].postdtl[0].photo != "") {
                    $('#lblPostUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.pDetails[0].postdtl[0].photo)
                }
                else {
                    $('#lblPostUserImage').attr('src', 'img/user.png')
                }
                $('#lblPostContent').html(rply.pDetails[0].postdtl[0].post_content)
                if (rply.pDetails[0].postdtl[0].post_image) {
                    if (rply.pDetails[0].postdtl[0].file_type == "pdf") {
                        $('#lblPostContent').append('<br><br>');
                        $('#lblPostContent').append(`<img src="img/pdf.png" width="25%" onclick="
                    phonegapApp.openPDFupload('http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}');">`);
                    }
                    else if (rply.pDetails[0].postdtl[0].file_type == "youtube") {
                        $('#lblPostContent').append('<br><br>');
                        let youtubeVideoId = rply.pDetails[0].postdtl[0].youtube_link
                        youtubeVideoId = youtubeVideoId.split("/")
                        $('#lblPostContent').append(`<img src="${rply.pDetails[0].postdtl[0].post_image}" width="100%" onclick="YoutubeVideoPlayer.openVideo('${youtubeVideoId[3]}')">`);
                    }
                    else if (rply.pDetails[0].postdtl[0].file_type == "image"){
                        $('#lblPostContent').append('<br><br>');
                        $('#lblPostContent').append(`<img src="http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}" width="100%" >`);
                    }

                }
                // if (rply.pDetails[0].postdtl[0].file_type == "pdf") {
                //     $('#lblPostContent').append('<br><br>');
                //     $('#lblPostContent').append(`<img src="img/pdf.png" width="100%" onclick="
                //     phonegapApp.openPDFupload('http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}');">`);
                // }
            }
            else if (rply.pDetails[0].postdtl[0].user_type == "G") {
                console.log('I am guardian block')
                $('#lblpostUserName').html(rply.pDetails[0].postdtl[0].name);
                $('#lblPostContent').html(rply.pDetails[0].postdtl[0].post_content)
                if (rply.pDetails[0].postdtl[0].file_type == "pdf") {
                    $('#lblPostContent').append('<br><br>');
                    $('#lblPostContent').append(`<img src="img/pdf.png" width="25%" onclick="
                    phonegapApp.openPDFupload('http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}');">`);
                }
                else if (rply.pDetails[0].postdtl[0].file_type == "youtube") {
                    $('#lblPostContent').append('<br><br>');
                    $('#lblPostContent').append('<br><br>');
                    let youtubeVideoId = rply.pDetails[0].postdtl[0].youtube_link
                    youtubeVideoId = youtubeVideoId.split("/")
                    $('#lblPostContent').append(`<img src="${rply.pDetails[0].postdtl[0].post_image}" width="100%" onclick="YoutubeVideoPlayer.openVideo('${youtubeVideoId[3]}')">`);
                    
                    // $('#lblPostContent').append(`<a href="${rply.pDetails[0].postdtl[0].youtube_link}" class="link external"><img src="${rply.pDetails[0].postdtl[0].post_image}" width="25%" ></a>`);
                }
                else if (rply.pDetails[0].postdtl[0].file_type == "image") {
                    $('#lblPostContent').append('<br><br>');
                    $('#lblPostContent').append(`<img src="http://guru-siksha.com/uploads/posts/${rply.pDetails[0].postdtl[0].post_image}" width="100%" >`);
                }
            }
            // else{
            //     console.log('I am no block')
            // }

            $('#txtPostIdComment').val(rply.pDetails[0].postdtl[0].post_id);
            $('#lblCurrentUserImage').css('background-image', 'url(' + userImage + ')')
            // This Section For Comment
            if (rply.pDetails[0].postCmnt.length) {
                let comments = ''
                for (list in rply.pDetails[0].postCmnt) {
                    comments += '<div class="message message-received">'
                    if (rply.pDetails[0].postCmnt[list].photo != "") {
                        if (rply.pDetails[0].postCmnt[list].user_type == "M") {
                            comments += '<div class="message-avatar" style="background-image:url(http://guru-siksha.com/uploads/mentor/' + rply.pDetails[0].postCmnt[list].photo + ');"></div>'
                        }
                        else if (rply.pDetails[0].postCmnt[list].user_type == "S") {
                            comments += '<div class="message-avatar" style="background-image:url(http://guru-siksha.com/uploads/mentor/' + rply.pDetails[0].postCmnt[list].photo + ');"></div>'
                        }
                        else {
                            comments += '<div class="message-avatar" style="background-image:url(http://guru-siksha.com/uploads/mentor/' + rply.pDetails[0].postCmnt[list].photo + ');"></div>'
                        }
                    }
                    else {
                        comments += '<div class="message-avatar" style="background-image:url(img/user.jpg);"></div>'
                    }
                    comments += '<div class="message-content">'
                    if (rply.pDetails[0].postCmnt[list].user_type == "M") {
                        comments += '<div class="message-name">' + rply.pDetails[0].postCmnt[list].mentor_name + '</div>'
                    }
                    else if (rply.pDetails[0].postCmnt[list].user_type == "S") {
                        comments += '<div class="message-name">' + rply.pDetails[0].postCmnt[list].student_name + '</div>'
                    }
                    else {
                        comments += '<div class="message-name">' + rply.pDetails[0].postCmnt[list].gurdian_name + '</div>'
                    }

                    comments += '<div class="message-bubble">'
                    comments += '<div class="message-text">' + rply.pDetails[0].postCmnt[list].comment_content + '</div>'
                    comments += '</div>'
                    comments += '</div>'
                    comments += '</div>'
                    $('#lblPostComment').html(comments);

                }
            }
            else {
                $('#lblPostComment').html('<p align="center">No Comment Found</p>');
            }


            if (rply.pDetails[0].postdtl[0].user_id == userId && rply.pDetails[0].postdtl[0].user_type == userType) {
                var ac3 = app.actions.create({
                    buttons: [
                        // First group
                        [
                            {
                                text: 'Action',
                                label: true
                            },
                            {
                                text: '<i class="material-icons icon">delete_forever</i>&nbsp;Delete Post',
                                onClick: function () {
                                    phonegapApp.deletePost(rply.pDetails[0].postdtl[0].post_id)
                                },
                                bold: true
                            },
                        ],
                        // Second group
                        [
                            {
                                text: 'Cancel',
                                color: 'red'
                            }
                        ]
                    ]
                })
            }
            else {
                if (rply.pDetails[0].postdtl[0].user_type == "M") {
                    var ac3 = app.actions.create({
                        buttons: [
                            // First group
                            [
                                {
                                    text: 'Action',
                                    label: true
                                },
                                {
                                    text: '<i class="material-icons icon text-color-red">report</i>&nbsp;Report Post',
                                    onClick: function () {
                                        phonegapApp.reportPost(rply.pDetails[0].postdtl[0].post_id)
                                    },
                                    bold: true
                                },
                            ],
                            [
                                {
                                    text: '<i class="material-icons icon text-color-green">rate_review</i>&nbsp;Rate Mentor',
                                    onClick: function () {
                                        localStorage.setItem('mentorIdRate', rply.pDetails[0].postdtl[0].user_id)
                                        app.sheet.open('.star-rate')
                                    },
                                    bold: true
                                },
                            ],
                            // Second group
                            [
                                {
                                    text: 'Cancel',
                                    color: 'red'
                                }
                            ]
                        ]
                    })
                }
                else {
                    var ac3 = app.actions.create({
                        buttons: [
                            // First group
                            [
                                {
                                    text: 'Action',
                                    label: true
                                },
                                {
                                    text: '<i class="material-icons icon">report</i>&nbsp;Report Post',
                                    onClick: function () {
                                        phonegapApp.reportPost(rply.pDetails[0].postdtl[0].post_id)
                                    },
                                    bold: true
                                },
                            ],
                            // Second group
                            [
                                {
                                    text: 'Cancel',
                                    color: 'red'
                                }
                            ]
                        ]
                    })
                }

            }

            $$('#morePost').on('click', function () {
                ac3.open()
            });

        })
    },




    // This function for comment
    comment: function () {
        if ($('#txtPostComment').val()) {
            $.ajax({
                type: "post",
                url: url + "PostComment",
                data: { postId: $('#txtPostIdComment').val(), userId: userId, userType: userType, comment: $('#txtPostComment').val() },
                dataType: "json"
            }).done(function (rply) {
                $('#txtPostComment').val('')
                phonegapApp.postDetails($('#txtPostIdComment').val())
            })
        }

    },

    // This Section For Save Content
    saveContent: function () {
        let saveContent = ''
        $.ajax({
            type: "post",
            url: url + "SavedPost",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.saveDtl) {
                saveContent += `<div class="card demo-facebook-card" id="SavePost${rply.saveDtl[list].pdtl[0].post_id}">`
                saveContent += '<div class="card-header">'
                if (rply.saveDtl[list].post_user[0].photo) {
                    saveContent += `<div class="demo-facebook-avatar"><img src="http://guru-siksha.com/uploads/mentor/${rply.saveDtl[list].post_user[0].photo}" width="34" height="34" style="border-radius: 50%" /></div>`
                    // http://guru-siksha.com/uploads/mentor/1544084322.png
                }
                else {
                    saveContent += `<div class="demo-facebook-avatar"><img src="img/user.jpg" width="34" height="34" style="border-radius: 50%" /></div>`
                }

                if (rply.saveDtl[list].pdtl[0].user_type == "M") {
                    saveContent += `<div class="demo-facebook-name">${rply.saveDtl[list].post_user[0].mentor_name}</div>`
                }
                else if (rply.saveDtl[list].pdtl[0].user_type == "S") {
                    saveContent += `<div class="demo-facebook-name">${rply.saveDtl[list].post_user[0].name}</div>`
                }
                else {
                    saveContent += `<div class="demo-facebook-name">${rply.saveDtl[list].post_user[0].name}</div>`
                }
                saveContent += `<div class="demo-facebook-date">${rply.saveDtl[list].pdtl[0].created_date} at ${rply.saveDtl[list].pdtl[0].created_time}</div>`
                saveContent += `</div>`
                saveContent += `<div class="card-content card-content-padding">`
                saveContent += `<a href="/post-details/${rply.saveDtl[list].pdtl[0].post_id}/" class="title text-color-black">`
                saveContent += `<div>${rply.saveDtl[list].pdtl[0].post_content}</div>`
                if (rply.saveDtl[list].pdtl[0].post_image) {
                    saveContent += `<img src="http://guru-siksha.com/uploads/posts/${rply.saveDtl[list].pdtl[0].post_image}" width="100%" </div>`
                }
                saveContent += `<div class="likes">Views: ${rply.saveDtl[list].post_view} &nbsp&nbsp Comments: ${rply.saveDtl[list].post_cmnt}</div>`
                saveContent += `</a>`
                saveContent += `</div>`
                saveContent += `<div class="card-footer">`
                saveContent += `<a href="#" class="link icon-only text-color-black like" id="post${rply.saveDtl[list].pdtl[0].post_id}" onclick="phonegapApp.postDislike(${rply.saveDtl[list].pdtl[0].post_id},'SavePost${rply.saveDtl[list].pdtl[0].post_id}')"><i class="icon material-icons color-red" >star</i></a>`
                saveContent += `<a href="/post-details/${rply.saveDtl[list].pdtl[0].post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                if (rply.saveDtl[list].pdtl[0].post_image && rply.saveDtl[list].pdtl[0].file_type != "youtube") {
                    saveContent += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.saveDtl[list].pdtl[0].post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.saveDtl[list].pdtl[0].post_image}', 'http://gurusiksha://post/${rply.saveDtl[list].pdtl[0].post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }
                else {
                    saveContent += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.saveDtl[list].pdtl[0].post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://gurusiksha://post/${rply.saveDtl[list].pdtl[0].post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }

                saveContent += `</div>`
                saveContent += `</div>`
                $('#lblSavePostList').html(saveContent)
            }
        })
    },


    // This Function For Delete Post
    deletePost: function (postId) {
        $.ajax({
            type: "post",
            url: url + "deletePost",
            data: { postId: postId },
            dataType: "json"
        }).done(function (rply) {
            app.views["current"].router.back()
            app.dialog.alert('Post Deleted')
            app.views["current"].router.refreshPage()
        })
    },

    // This Function For Report Post
    reportPost: function (postId) {
        $.ajax({
            type: "post",
            url: url + "reportPost",
            data: { postId: postId, userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            app.views["current"].router.back()
        })
    },


    // This Function For Edit User
    getStudentDataForEdit: function () {
        $.ajax({
            type: "post",
            url: url + "studentDetails",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {

            $('#txtEditStudentName').val(rply.studentDtl[0].name)
            $('#txtEditStudentDOB').val(rply.studentDtl[0].dob)
            $('#txtEditStudentAddress').val(rply.studentDtl[0].address)
            $('#txtEditStudentPin').val(rply.studentDtl[0].pin)
            $('#txtEditStudentGender').val(rply.studentDtl[0].gender)
            $('#txtEditStudentSchool').val(rply.studentDtl[0].school)
            $('#txtEditStudentBoard').val(rply.studentDtl[0].board_name)


            $('#profile-user-image').attr('src', userImage)


            // $('#txtEditStudentSubject').val(rply.studentDtl[0].board_name)
        })
    },


    // Update Student data
    updateStudentData: function () {


        let selectedSubjectList = new Array();
        $('input[name="txtEditStudentSubject"]:checked').each(function () {
            selectedSubjectList.push(this.value);
        });
        $.ajax({
            type: "post",
            url: url + "studentUpdateDetails",
            data: { name: $('#txtEditStudentName').val(), dob: $('#txtEditStudentDOB').val(), address: $('#txtEditStudentAddress').val(), pin: $('#txtEditStudentGender').val(), school: $('#txtEditStudentSchool').val(), board: $('#txtEditStudentBoard').val(), userId: userId },
            dataType: "json",
        }).done(function (rply) {
            app.dialog.alert('Profile Update')
        })
    },

    // Get Student Subject , Times , Days
    getAssignDetails: function () {
        $.ajax({
            type: "post",
            url: url + "studentSubjects",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            // Select Date
            let assignSubject = ''
            assignSubject += '<option value="" selected>Select Subject</option>'
            for (list in rply.studentSubjects) {
                assignSubject += `<option value="${rply.studentSubjects[list].subject_id}">${rply.studentSubjects[list].subject}</option>`

            }
            $('#selectAssignSubjectList').html(assignSubject)

            // Select Day
            let assignDay = ''
            assignDay += '<option value="" selected>Select Day</option>'
            for (list in rply.AllDays) {
                assignDay += `<option value="${rply.AllDays[list].day_id}">${rply.AllDays[list].day}</option>`
                $('#selectAssignDay').html(assignDay)
            }


            // From Time And To Time
            let assignTime = ''
            assignTime += '<option value="" selected>Select Time</option>'
            for (list in rply.AllTime) {
                assignTime += `<option value="${rply.AllTime[list].time_id}">${rply.AllTime[list].time}</option>`
                $('#selectAssignTimeFrom').html(assignTime)
            }
            $('#selectAssignTimeTo').html(assignTime)


        })
    },


    // This function for search mentor
    searchMentor: function () {
        if ($('#selectAssignSubjectList').val() != "" && $('#selectAssignDay').val() != "" && $('#selectAssignTimeFrom').val() != "" && $('#selectAssignTimeTo').val() != "" && $('#selectTutionType').val() != "") {
            $.ajax({
                type: "post",
                url: url + "searchMentor",
                data: { subject: $('#selectAssignSubjectList').val(), day: $('#selectAssignDay').val(), fromtime: $('#selectAssignTimeFrom').val(), totime: $('#selectAssignTimeTo').val(), tutionType: $('#selectTutionType').val(), userId: userId, userType: userType },
                dataType: "json"
            }).done(function (rply) {
                if (rply.success) {
                    $('#listing').hide()

                    let count = 0
                    let mentorResult = ''

                    for (list in rply.mentorDetails) {
                        mentorResult += '<div class="row">'
                        mentorResult += '<div class="col">'
                        mentorResult += '<div class="elevation-demo elevation-6 elevation-hover-24 elevation-pressed-12 elevation-transition text-align-center">'
                        if (rply.mentorDetails[list].mentorsDtl.photo) {
                            mentorResult += `<img src="http://guru-siksha.com/uploads/mentor/${rply.mentorDetails[list].mentorsDtl.photo}" alt="" class="suggestion-user-image">`
                        }
                        else {
                            mentorResult += `<img src="img/user.jpg" alt="" class="suggestion-user-image">`
                        }

                        mentorResult += `<div class="title module line-clamp" style="font-size:12px;line-height:1;margin-bottom: 5px;">${rply.mentorDetails[list].mentorsDtl.mentor_name}</div>`
                        mentorResult += `<div class="title module line-clamp" style="font-size:12px;line-height:1;margin-bottom: 5px;">&#x20b9; ${rply.mentorDetails[list].mentorFee}/-</div>`
                        mentorResult += '<div  style="padding: 7px">'
                        mentorResult += `<button class="col button button-small button-fill color-blue" onclick="phonegapApp.selectMentor(${rply.mentorDetails[list].mentorsDtl.mentor_id},${rply.mentorDetails[list].mentorsDtl.pf_time_id},${rply.mentorDetails[list].mentorFee})">Select</button>`
                        mentorResult += '</div>'
                        mentorResult += '</div>'
                        mentorResult += '</div>'
                        mentorResult += '</div>'

                        $('#result').html(mentorResult)
                    }
                    $('#result').show()
                }
                else {
                    var toastCenter = app.toast.create({
                        text: 'Sorry no mentor found',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                }
            })
        }
        else {
            var toastCenter = app.toast.create({
                text: 'All field mandetory',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },

    // This Function For Select Mentor
    // selectMentor: function (mentorId, pfTimeId, fee) {
    //     $.ajax({
    //         type: "post",
    //         url: url + "selectMentor",
    //         data: { subject: $('#selectAssignSubjectList').val(), day: $('#selectAssignDay').val(), fromtime: $('#selectAssignTimeFrom').val(), totime: $('#selectAssignTimeTo').val(), mentorId: mentorId, pfTimeId: pfTimeId, userId: userId, fee: fee, tutionType: $('#selectTutionType').val() },
    //         dataType: "json"
    //     }).done(function (rply) {
    //         // app.dialog.alert('Mentor assign successfully')
    //         console.log(rply)
    //         //let onlinePaymentUrl = 'http://platterexoticfood.com/' + localStorage.getItem('platuser') + '/' + encodeURI(finalAmount) + '/'
    //         let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');

    //         ref.addEventListener('loadstop', function (event) {
    //             console.log(event.url)
    //             let urlSuccessPage = "http://www.guru-siksha.com/success.php";
    //             let urlErrorPage = "http://www.guru-siksha.com/fail.php";
    //             if (event.url == urlSuccessPage) {
    //                 ref.close()
    //                 $.ajax({
    //                     type: "post",
    //                     url: url + "OnlineSuccessPay/",
    //                     data: { ordrId: rply.oid, userId: userId },
    //                     dataType: "JSON"
    //                 })
    //                 app.dialog.alert('Mentor Select Successfully')
    //                 // cartView.router.navigate('/payment-success/' + rply.oid + '/');

    //             }
    //             else if (event.url == urlErrorPage) {
    //                 ref.close()
    //                 app.dialog.alert('Payment Not Done')
    //             }
    //         });
    //     })
    // },

    selectMentor: function () {
        $.ajax({
            type: "post",
            url: url + "selectMentor",
            data: { subject: $('#ddlPackagePaynmentSelectSubject').val(), day: $('#ddlDaysPackage').val(), time: $('#ddlHourPackage').val(), mentorId: localStorage.getItem('tempMentorId'), userId: userId, fee: $('#amountTotal').html(), tutionType: $('#ddlPackagePaynmentSelectType').val(), packId: $('#ddlPackagePayment').val(), orgPrice: $('#amountPay').html()},
            dataType: "json"
        }).done(function (rply) {
            // app.dialog.alert('Mentor assign successfully')
            //let onlinePaymentUrl = 'http://platterexoticfood.com/' + localStorage.getItem('platuser') + '/' + encodeURI(finalAmount) + '/'
            let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');

            ref.addEventListener('loadstop', function (event) {
                let urlSuccessPage = "http://www.guru-siksha.com/success.php";
                let urlErrorPage = "http://www.guru-siksha.com/fail.php";
                if (event.url == urlSuccessPage) {
                    ref.close()
                    $.ajax({
                        type: "post",
                        url: url + "OnlineSuccessPay/",
                        data: { ordrId: rply.oid, userId: userId },
                        dataType: "JSON"
                    })
                    app.dialog.alert('Mentor Select Successfully')
                    // cartView.router.navigate('/payment-success/' + rply.oid + '/');

                }
                else if (event.url == urlErrorPage) {
                    ref.close()
                    app.dialog.alert('Payment Not Done')
                }
            });
        })
    },



    // This Function For Time - line 
    studentTimeline: function () {
        let studentTimeLinePost = ''
        postCountStudent = 0
        $.ajax({
            type: "post",
            url: url + "studentTimeline",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done((rply) => {
            for (list in rply.allpost) {
                if (list == 2){
                    studentTimeLinePost += '<div class="card">'
                    studentTimeLinePost += '<div class="card-content">'
                    studentTimeLinePost += '<a class="link" href="/current-assigment/"><img src="img/guru-onlineexam-banner.jpg" width="100%"></a>'
                    studentTimeLinePost += '</div>'
                    
                    studentTimeLinePost += '</div>'
                }
                if (rply.allpost[list].postDetailsNEw.user_type == "S")
                    studentTimeLinePost += '<div class="card demo-facebook-card" style="background-color: #fbe298;">'
                else
                    studentTimeLinePost += '<div class="card demo-facebook-card">'

                studentTimeLinePost += '<div class="card-header">'
                studentTimeLinePost += '<div class="demo-facebook-avatar">'

                studentTimeLinePost += `<a href="/user-timeline/${rply.allpost[list].postDetailsNEw.user_id}/${rply.allpost[list].postDetailsNEw.user_type}/">`

                if (rply.allpost[list].PostUsers.photo == "" || rply.allpost[list].PostUsers.photo == null)
                    studentTimeLinePost += '<img src="img/user.jpg" width="34" height="34">'
                else
                    studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allpost[list].PostUsers.photo}" width="34" height="34">`

                studentTimeLinePost += ' </div>'
                if (rply.allpost[list].postDetailsNEw.user_type == "M")
                    studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.mentor_name}</div>`
                else
                    studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.name}</div>`

                studentTimeLinePost += '</a>'
                studentTimeLinePost += `<div class="demo-facebook-date">${rply.allpost[list].postDetailsNEw.created_date} at ${rply.allpost[list].postDetailsNEw.created_time}</div>`
                studentTimeLinePost += '</div>'
                studentTimeLinePost += ' <div class="card-content card-content-padding">'
                studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="title text-color-black">`
                if (rply.allpost[list].postDetailsNEw.user_type == "S")
                    studentTimeLinePost += `<div><div class="text-align-center" style="font-weight: 800;font-size: 18px;color: #e45b02;">Student's Question</div>${rply.allpost[list].postDetailsNEw.post_content}</div>`
                else
                    studentTimeLinePost += `<div>${rply.allpost[list].postDetailsNEw.post_content}</div>`

                if (rply.allpost[list].postDetailsNEw.file_type == "pdf") {
                    studentTimeLinePost += `<img src="img/pdf.png" class="lazy lazy-fade-in" width="25%" </div> `
                }
                else if (rply.allpost[list].postDetailsNEw.file_type == "youtube"){
                    studentTimeLinePost += `<img src="${rply.allpost[list].postDetailsNEw.post_image}" width="100%" class="lazy lazy-fade-in" </div>`
                }
                else if (rply.allpost[list].postDetailsNEw.file_type == "image") {
                    studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`

                }

                studentTimeLinePost += `<div class="likes">Views: ${rply.allpost[list].totView} &nbsp&nbsp Comments: ${rply.allpost[list].totComnt}</div>`
                studentTimeLinePost += '</a>'
                studentTimeLinePost += '</div>'
                studentTimeLinePost += '<div class="card-footer">'
                if (rply.allpost[list].myLike) {
                    studentTimeLinePost += `<a href="#" class="link icon-only text-color-black like" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postDislike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                }
                else {
                    studentTimeLinePost += ` <a href="#" class="link icon-only text-color-black" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postLike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons">star_border</i></a>`
                }

                studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`

                if (rply.allpost[list].postDetailsNEw.post_image && rply.allpost[list].postDetailsNEw.file_type != "youtube") {
                    studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}', 'http://guru-siksha.com//posts/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }
                else {
                    studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }


                studentTimeLinePost += '</div>'
                studentTimeLinePost += '</div>'


                postCountStudent = rply.allpost.length
                $('#timelinePostGurusiksha').html(studentTimeLinePost)
            }

        })
    },


    timelineNextPost: function () {
        let studentTimeLinePost = ''
        if (userType == 'S') {
            $.ajax({
                type: "post",
                url: url + "studentTimelineLazy",
                data: { userId: userId, userType: userType, postcount: postCountStudent },
                dataType: "json"
            }).done(function (rply) {
                let studentTimeLinePost = ''
                for (list in rply.allpost) {
                    studentTimeLinePost += '<div class="card demo-facebook-card">'
                    studentTimeLinePost += '<div class="card-header">'
                    studentTimeLinePost += '<div class="demo-facebook-avatar">'

                    studentTimeLinePost += `<a href="/user-timeline/${rply.allpost[list].postDetailsNEw.user_id}/${rply.allpost[list].postDetailsNEw.user_type}/">`

                    if (rply.allpost[list].PostUsers.photo == "")
                        studentTimeLinePost += '<img src="img/user.jpg" width="34" height="34">'
                    else
                        studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allpost[list].PostUsers.photo}" width="34" height="34">`

                    studentTimeLinePost += ' </div>'
                    if (rply.allpost[list].postDetailsNEw.user_type == "M")
                        studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.mentor_name}</div>`
                    else
                        studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.name}</div>`

                    studentTimeLinePost += '</a>'
                    studentTimeLinePost += `<div class="demo-facebook-date">${rply.allpost[list].postDetailsNEw.created_date} at ${rply.allpost[list].postDetailsNEw.created_time}</div>`
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += ' <div class="card-content card-content-padding">'
                    studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="title text-color-black">`
                    studentTimeLinePost += `<div>${rply.allpost[list].postDetailsNEw.post_content}</div>`
                    if (rply.allpost[list].postDetailsNEw.post_image) {
                        if (rply.allpost[list].postDetailsNEw.file_type == "pdf")
                            studentTimeLinePost += `<img src="img/pdf.png" class="lazy lazy-fade-in" width="25%" </div>`
                        else if (rply.allpost[list].postDetailsNEw.file_type == "youtube")
                            studentTimeLinePost += `<img src="${rply.allpost[list].postDetailsNEw.post_image}" width="100%" class="lazy lazy-fade-in" </div>`
                        else if (rply.allpost[list].postDetailsNEw.file_type == "image")
                            studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`
                    }

                    studentTimeLinePost += `<div class="likes">Views: ${rply.allpost[list].totView} &nbsp&nbsp Comments: ${rply.allpost[list].totComnt}</div>`
                    studentTimeLinePost += '</a>'
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += '<div class="card-footer">'
                    if (rply.allpost[list].myLike) {
                        studentTimeLinePost += `<a href="#" class="link icon-only text-color-black like" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postDislike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                    }
                    else {
                        studentTimeLinePost += ` <a href="#" class="link icon-only text-color-black" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postLike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons">star_border</i></a>`
                    }

                    studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`

                    if (rply.allpost[list].postDetailsNEw.post_image && rply.allpost[list].postDetailsNEw.file_type != "youtube") {
                        studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}', 'http://guru-siksha.com//posts/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }
                    else {
                        studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += '</div>'
                    postCountStudent = parseInt(postCountStudent) + 1                    
                }
                $('#timelinePostGurusiksha').append(studentTimeLinePost)
            })
        }
        else if (userType == 'M') {
            $.ajax({
                type: "post",
                url: url + "mentorTimelineLazy",
                data: { userId: userId, userType: userType, postcount: postCountMentor },
                dataType: "json"
            }).done(function (rply) {
                let ownPost = ''
                for (list in rply.allpost) {
                    if (rply.allpost[list].postDetailsNEw.user_type == "M")
                        studentTimeLinePost += '<div class="card demo-facebook-card">'
                    else
                        studentTimeLinePost += '<div class="card demo-facebook-card" style="background-color: #fbe298;">'
                    studentTimeLinePost += '<div class="card-header">'
                    studentTimeLinePost += '<div class="demo-facebook-avatar">'

                    studentTimeLinePost += `<a href="/user-timeline/${rply.allpost[list].postDetailsNEw.user_id}/${rply.allpost[list].postDetailsNEw.user_type}/">`

                    if (rply.allpost[list].PostUsers.photo == "")
                        studentTimeLinePost += '<img src="img/user.jpg" width="34" height="34">'
                    else
                        studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allpost[list].PostUsers.photo}" width="34" height="34">`

                    studentTimeLinePost += ' </div>'
                    if (rply.allpost[list].postDetailsNEw.user_type == "M")
                        studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.mentor_name}</div>`
                    else
                        studentTimeLinePost += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.name}</div>`

                    studentTimeLinePost += '</a>'
                    studentTimeLinePost += `<div class="demo-facebook-date">${rply.allpost[list].postDetailsNEw.created_date} at ${rply.allpost[list].postDetailsNEw.created_time}</div>`
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += ' <div class="card-content card-content-padding">'
                    studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="title text-color-black">`
                    if (rply.allpost[list].postDetailsNEw.user_type == "M")
                      studentTimeLinePost += `<div>${rply.allpost[list].postDetailsNEw.post_content}</div>`
                    else
                        studentTimeLinePost += `<div>
                        <div class="text-align-center" style="font-weight: 800;font-size: 18px;color: #e45b02;">Student's Question</div>${rply.allpost[list].postDetailsNEw.post_content}</div>`

                    if (rply.allpost[list].postDetailsNEw.post_image) {
                        if (rply.allpost[list].postDetailsNEw.file_type === "pdf")
                            studentTimeLinePost += `<img src="img/pdf.png" width="25%" </div>`

                        else
                            studentTimeLinePost += `<img src="http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}" width="100%" </div>`
                    }

                    studentTimeLinePost += `<div class="likes">Views: ${rply.allpost[list].totView} &nbsp&nbsp Comments: ${rply.allpost[list].totComnt}</div>`
                    studentTimeLinePost += '</a>'
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += '<div class="card-footer">'
                    if (rply.allpost[list].myLike) {
                        studentTimeLinePost += `<a href="#" class="link icon-only text-color-black like" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postDislike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                    }
                    else {
                        studentTimeLinePost += ` <a href="#" class="link icon-only text-color-black" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postLike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons">star_border</i></a>`
                    }

                    studentTimeLinePost += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`

                    if (rply.allpost[list].postDetailsNEw.post_image && rply.allpost[list].postDetailsNEw.file_type != "youtube") {
                        studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}', 'http://guru-siksha.com//posts/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }
                    else {
                        studentTimeLinePost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }
                    studentTimeLinePost += '</div>'
                    studentTimeLinePost += '</div>'
                    postCountMentor = parseInt(postCountMentor) + 1
                }
                $('#timelinePostGurusiksha').append(studentTimeLinePost)
            })
        }

    },

    // This Section For View User Profile
    viewUserProfile: function (profileuserId, profileuserType) {
        let ownPost = ''
        $.ajax({
            type: "post",
            url: url + "getUserProfile",
            data: { profileUserId: profileuserId, profileUserType: profileuserType, userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            // app.preloader.show()
            postCount = 0
            let anotherUserImage = ''
            
            if(profileuserType == "M"){
                // This Section For Bind Data 
                $('#lbl-user-profile-name').html(rply.userDetails[0].mentor_name)
                $('#user-profile-username').html(rply.userDetails[0].mentor_name)
                $('#user-profile-bio').html(rply.userDetails[0].about)
                $('#user-profile-achivement').html(rply.userDetails[0].achievements)
                $('#user-profile-post-count').html(rply.posts)
                $('#user-profile-following-count').html(rply.followings)
                $('#user-profile-followers-count').html(rply.followers)
                $('#TakeTracherSection').show()
                if (rply.userDetails[0].teachingType == "Offline" || rply.userDetails[0].teachingType == "" )
                    $('#selected-location-teacher-prefered-location').show();
                    $('#follow-mentor-button').attr('onclick', 'followMentor(' + profileuserId +')');
                
                
                    let mentorTimeing = ''
                    $('#time-table-mantor-teach-time-profile').show()
                    for (list in rply.techTimeArray) {
                        mentorTimeing += `<tr>` +
                            `<td class="label-cell">${rply.techTimeArray[list].day}</td>` +
                            `<td class="label-cell">${rply.techTimeArray[list].startTime}</td>` +
                            `<td class="label-cell">${rply.techTimeArray[list].endTime}</td>` +
                            `</tr>`

                        $('#lblTimeListMentorTeachTime').html(mentorTimeing);
                    }

                let locationList = '<div class="block-title">Preffered Location</div>'

                for (list in rply.locationArray){
                    locationList += '<div class="chip">'+
                    `<div class="chip-media bg-color-green">`+
                    `<i class="icon f7-icons ios-only">compass</i>`+
                    `<i class="icon material-icons md-only">location_on</i>`+
                    `</div>`+
                        `<div class="chip-label">${rply.locationArray[list].title}</div>`+
                    `</div>`
                    
                    $('#selected-location-teacher-prefered-location').html(locationList);
                }

                if (rply.mentfollow == 0) {
                    $('#lblUserFollowButton').show()
                    $('#lblUserFollowButton').attr('onclick', phonegapApp.submitFollow(profileuserId));
                    
                }

                $('#lblUserDemoClass').show()
                $('#lblUserDemoClassButton').attr('onclick', `phonegapApp.demoClassData(${profileuserId})`);
                $('#lblUserPaidClassButton').attr('onclick', `phonegapApp.paidClassData(${profileuserId})`);

                if (rply.userDetails[0].photo) {
                    $('#image-user-profile').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                    anotherUserImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                }
                else {
                    $('#image-user-profile').attr('src', 'img/user.jpg')
                    anotherUserImage = 'img/user.jpg'
                }


                for (list in rply.postsDtl) {
                    ownPost += '<div class="card demo-facebook-card">'
                    ownPost += '<div class="card-header">'
                    ownPost += `<div class="demo-facebook-avatar"><img src="${anotherUserImage}" width="34" height="34" style="border-radius: 50%" /></div>`
                    ownPost += `<div class="demo-facebook-name">${rply.userDetails[0].mentor_name}</div>`
                    ownPost += `<div class="demo-facebook-date">${rply.postsDtl[list].postdtl.created_date} at ${rply.postsDtl[list].postdtl.created_time}</div>`
                    ownPost += `</div>`
                    ownPost += `<div class="card-content card-content-padding">`
                    ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="title text-color-black">`
                    ownPost += `<div>${rply.postsDtl[list].postdtl.post_content}</div>`
                    if(rply.postsDtl[list].postdtl.file_type==""){
                        if (rply.postsDtl[list].postdtl.post_image) {
                            ownPost += `<img src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%" >`
                        }
                    }
                    else{
                        ownPost += `<embed src="http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}" width="100%"  />`
                    }
                    
                    ownPost += `<div class="likes">Views: ${rply.postsDtl[list].postview} &nbsp&nbsp Comments: ${rply.postsDtl[list].postCmnt}</div>`
                    ownPost += `</a>`
                    ownPost += `</div>`
                    ownPost += `<div class="card-footer">`
                    if (rply.postsDtl[list].plike) {
                        ownPost += `<a href="#" class="link icon-only text-color-black like" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postDislike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                    }
                    else {
                        ownPost += ` <a href="#" class="link icon-only text-color-black" id="post${rply.postsDtl[list].postdtl.post_id}" onclick="phonegapApp.postLike(${rply.postsDtl[list].postdtl.post_id},'post${rply.postsDtl[list].postdtl.post_id}')"><i class="icon material-icons">star_border</i></a>`
                    }
                    ownPost += `<a href="/post-details/${rply.postsDtl[list].postdtl.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`
                    if (rply.postsDtl[list].postdtl.post_image && rply.postsDtl[list].postdtl.file_type != "youtube")  {
                        ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.postsDtl[list].postdtl.post_image}', 'http://guru-siksha.com//posts/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }
                    else {
                        ownPost += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.postsDtl[list].postdtl.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.postsDtl[list].postdtl.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                    }

                    ownPost += `</div>`
                    ownPost += `</div>`
                    postCount = parseInt(postCount) + 1
                    $('#another-user-post').html(ownPost)
                }
            }

            else{
                if (rply.userDetails[0].photo) {
                    $('#image-user-profile').attr('src', 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo)
                    anotherUserImage = 'http://guru-siksha.com/uploads/mentor/' + rply.userDetails[0].photo
                }
                else {
                    $('#image-user-profile').attr('src', 'img/user.jpg')
                    anotherUserImage = 'img/user.jpg'
                }
                $('#lbl-user-profile-name').html(rply.userDetails[0].name)
                $('#user-profile-username').html(rply.userDetails[0].name)
                $('#user-profile-bio').html('<b>You can show only mentor profile</b>')
            }
            

            // app.router.navigate('/user-profile/')
        })
    },


    // This Function For Drop Your Message
    dropContactMessage: function () {
        if ($('#txtContactName').val() != "" && $('#txtContactEmail').val() != "" && $('#txtContactPhone').val() != "" && $('#txtContactMessage').val() != "") {
            $.ajax({
                type: "post",
                url: url + "contactSubmit",
                data: { name: $('#txtContactName').val(), email: $('#txtContactEmail').val(), phone: $('#txtContactPhone').val(), message: $('#txtContactMessage').val() },
                dataType: "json"
            }).done(function (rply) {
                var toastCenter = app.toast.create({
                    text: 'Your message submit successfully',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
            })
        }
        else {
            var toastCenter = app.toast.create({
                text: 'We need all fields',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }

    },

    // Drop Your Message
    dropEnquiry: function () {
        if ($('#txtEnquiryMessage').val() != "") {
            $.ajax({
                type: "post",
                url: url + "enquirySubmit",
                data: { message: $('#txtEnquiryMessage').val(), userId: userId, userType: userType },
                dataType: "json"
            }).done(function (rply) {
                var toastCenter = app.toast.create({
                    text: 'Your message submit successfully',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
            })
        }
        else {
            var toastCenter = app.toast.create({
                text: 'We need all fields',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },

    // This Section For offer subjects
    offerSubjects: function () {
        subjectList = ''
        $.ajax({
            type: "post",
            url: url + "offeredSubjects",
            data: {},
            dataType: "json"
        }).done(function (rply) {

            for (list in rply.feeDetails) {
                subjectList += '<li>'
                subjectList += '<div class="item-inner">'
                subjectList += '<div class="item-title-row">'
                subjectList += `<div class="item-title" style="font-size: 23px;">${rply.feeDetails[list].subject}</div>`
                subjectList += `</div>`
                subjectList += `<div class="item-subtitle" style="font-size: 19px;">${rply.feeDetails[list].mentor_name}</div>`
                subjectList += `<div class="item-text" style="font-size: 22px;color: #ff6501;">`
                subjectList += `<span>&#x20b9;</span>${rply.feeDetails[list].fee}.00`
                subjectList += `</div>`
                subjectList += `</div>`
                subjectList += `</li>`

                $('#lblOfferSubjectList').html(subjectList)
            }
        })
    },


    // This Sectio For Mentor Assignment Submit
    mentorAssignmnetSubmit: function () {
        let mentroSubjectList = ''
        $.ajax({
            type: "post",
            url: url + "mentorsSubjectDayTime",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            mentroSubjectList += `<option value="" hidden selected>Select Subject</option>`
            for (list in rply.subjects) {
                mentroSubjectList += `<option value="${rply.subjects[list].subject_id}">${rply.subjects[list].subject}</option>`

                $('#ddlSubjectAssgnment').html(mentroSubjectList)
            }
        })
    },

    // This Function For Get Student List AQccoding To Mentor Id And Mentor Select Subject
    getMentorStudentBySubjectId: function () {
        let userOption = ''
        if ($('#ddlSubjectAssgnment').val() != "") {
            app.preloader.show()
            $.ajax({
                type: "post",
                url: url + "getMentorStudentBySubjectId",
                data: { subject: $('#ddlSubjectAssgnment').val(), userId: userId },
                dataType: "json"
            }).done(function (rply) {
                for (list in rply.students) {
                    userOption += `<option value="${rply.students[list].user_id}" selected>${rply.students[list].name}</option>`
                    $('#ddlMentorStudents').html(userOption)
                    app.preloader.hide()
                }
            })
        }
    },

    // This Section For Upload Image For Assignment
    assignmetImageUpload: function () {
        navigator.camera.getPicture(onAssignmentSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        })
    },

    // This Section For Upload PDF For Assignment
    assignmetPDFUpload: function () {
        fileChooser.open({ "mime": "application/pdf" }, (imageURI) => {
            $('#txtImageFileForAssignment').val(imageURI)
            $('#txtImageFileForAssignmentType').val('pdf')
        }, (err) => {
        })
    },


    assignmentSuccess: function () {
        if ($('#txtImageFileForAssignment').val() != "" && $('#ddlMentorStudents').val() != "" && $('#ddlSubjectAssgnment').val() != "") {

            if ($('#txtImageFileForAssignmentType').val() == 'pdf') {
                
                let imageURI = $('#txtPostImage').val()
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "application/pdf";

                var params = new Object();
                params.type = "pdf";
                params.userId = userId;
                params.userType = userType;
                params.studentId = $('#ddlMentorStudents').val();
                params.image = $('#txtImageFileForAssignment').val();
                params.subjectId = $('#ddlSubjectAssgnment').val();

                options.params = params;
                options.chunkedMode = false;

                var ft = new FileTransfer();
                ft.upload(imageURI, url + "postAssignment",
                    function (result) {
                        var toastCenter = app.toast.create({
                            text: 'Assigment Send Successfully ',
                            position: 'center',
                            closeTimeout: 5000,
                        })
                        toastCenter.open()
                       
                    },
                    function (error) {
                    }, options);
            }
            else {
                $.ajax({
                    type: "post",
                    url: url + "postAssignment",
                    data: { userId: userId, studentId: $('#ddlMentorStudents').val(), image: $('#txtImageFileForAssignment').val(), subjectId: $('#ddlSubjectAssgnment').val(),type : 'img' },
                    dataType: "json"
                }).done(function (rply) {
                    if (rply.status) {
                        var toastCenter = app.toast.create({
                            text: 'Assignment Submit Successfully',
                            position: 'center',
                            closeTimeout: 2000,
                        })
                        toastCenter.open()
                    }
                })
            }

        }
        else {
            var toastCenter = app.toast.create({
                text: 'We Need all fields',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    },


    getMentorAssignment: function () {
        let assignmentList = ''
        $.ajax({
            type: "post",
            url: url + "getMentorAssignment",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.details) {
                assignmentList += `<li>`
                if (rply.details[list].post_type == "img"){
                    assignmentList += ` <a href="#" class="item-link item-content">`
                    assignmentList += `<div class="item-media"><img src="http://guru-siksha.com/uploads/${rply.details[list].post_image}" width="80" /></div>`
                    assignmentList += `<div class="item-inner">`
                    assignmentList += `<div class="item-title">${rply.details[list].created_date} at ${rply.details[list].created_time}</div>`
                    assignmentList += `</div>`
                    assignmentList += `</a>`
                }
                else{
                    assignmentList += ` <a href="#" class="item-link item-content">`
                    assignmentList += `<div class="item-media"><img src="img/pdf.png" width="80"  onclick="phonegapApp.openPDFupload('http://guru-siksha.com/uploads/${rply.details[list].post_image}');" /></div>`
                    assignmentList += `<div class="item-inner">`
                    assignmentList += `<div class="item-title">${rply.details[list].created_date} at ${rply.details[list].created_time}</div>`
                    assignmentList += `</div>`
                    assignmentList += `</a>`
                }   
                
                assignmentList += `</li>`

                $('#lblMentorAssignmentLists').html(assignmentList);
            }
        })
    },


    // This Function For Get student Assignment
    getStudentAssignment: function () {
        let assignmentList = ''
        $.ajax({
            type: "post",
            url: url + "getStudentAssignment",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.details) {
                assignmentList += `<div class="card demo-card-header-pic">`
                assignmentList += `<div style="background-image:url(http://guru-siksha.com/uploads/${rply.details[list].post_image})" class="card-header align-items-flex-end">by - ${rply.details[list].mentor_name} at ${rply.details[list].created_date},${rply.details[list].created_time} </div>`
                assignmentList += `<div class="card-footer"><a href="http://guru-siksha.com/uploads/${rply.details[list].post_image}" class="link external">Download</a></div>`
                assignmentList += `</div>`

                $('#lblStudentAssignmentList').html(assignmentList);

            }
        })
    },


    // This Section For Get Last Chat
    getLastChat: function () {
        $.ajax({
            type: "post",
            url: url + "getLastChat",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            $('#lblLastChatMessage').html(rply.chatDetails[0].msg)
            if (!rply.chatDetails[0].is_read) {
                $('#lblReadCheck').show()
            }
            else {
                $('#lblReadCheck').hide()
            }
        })
    },

    // This Function For Send Message To Admin
    sendMessage: function () {
        if ($('#txtSendAdminMessage').val() != "") {
            $.ajax({
                type: "post",
                url: url + "sendChat",
                data: { userId: userId, userType: userType, message: $('#txtSendAdminMessage').val() },
                dataType: "json"
            }).done(function (rply) {
                $('#txtSendAdminMessage').val('')
                phonegapApp.getMessage()
            })
        }
    },

    // This Section For Get Message
    getMessage: function () {
        let chatMessage = ''
        $.ajax({
            type: "post",
            url: url + "getChat",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.chatDetails) {
                if (rply.chatDetails[list].user_type == "A") {
                    chatMessage += `<div class="message message-received">`
                    chatMessage += `<div class="message-avatar" style="background-image:url(img/logo.png);"></div>`
                    chatMessage += `<div class="message-content">`
                    chatMessage += `<div class="message-name">Gurusiksha</div>`
                    chatMessage += `<div class="message-bubble">`
                    chatMessage += `<div class="message-text-header">${rply.chatDetails[list].chat_date}</div>`
                    if (rply.chatDetails[list].chat_file_type == ""){
                        chatMessage += `<div class="message-text">${rply.chatDetails[list].msg}</div>`
                    }
                    else{
                        if (rply.chatDetails[list].chat_file_type == 'pdf'){
                            chatMessage += `<div class="message-text">
                            <img src="img/pdf.png" width="25%" onclick="phonegapApp.openPDFupload('http://guru-siksha.com/uploads/chat/${rply.chatDetails[list].chat_file}')"></div>`
                        }
                        else{
                            chatMessage += `<div class="message-text">
                            <img src="http://guru-siksha.com/uploads/chat/${rply.chatDetails[list].chat_file}" width="100%"></div>`
                        }
                    }
                    
                    chatMessage += `<div class="message-text-footer">${rply.chatDetails[list].chat_time}</div>`
                    chatMessage += `</div>`

                    chatMessage += `</div>`
                    chatMessage += `</div>`
                }
                else {
                    chatMessage += `<div class="message message-sent">`
                    chatMessage += `<div class="message-avatar" style="background-image:url(${userImage});"></div>`
                    chatMessage += `<div class="message-content">`
                    chatMessage += `<div class="message-bubble">`
                    chatMessage += `<div class="message-text-header">${rply.chatDetails[list].chat_date}</div>`
                    if (rply.chatDetails[list].chat_file_type == "") {
                        chatMessage += `<div class="message-text">${rply.chatDetails[list].msg}</div>`
                    }
                    else {
                        if (rply.chatDetails[list].chat_file_type == 'pdf') {
                            chatMessage += `<div class="message-text">
                            <img src="img/pdf.png" width="25%" onclick="phonegapApp.openPDFupload('http://guru-siksha.com/uploads/chat/${rply.chatDetails[list].chat_file}')"></div>`
                        }
                        else {
                            chatMessage += `<div class="message-text">
                            <img src="http://guru-siksha.com/uploads/chat/${rply.chatDetails[list].chat_file}" width="100%"></div>`
                        }
                    }
                    chatMessage += `<div class="message-text-footer">${rply.chatDetails[list].chat_time}</div>`
                    chatMessage += `</div>`
                    chatMessage += `</div>`
                    chatMessage += `</div>`
                }

                $('#chatResult').html(chatMessage)
            }
        })
    },


    // This Function For Get Current Assigment
    currentAssigment: function () {

        // This Section For Current Subject And Chapter
        $.ajax({
            type: "post",
            url: url + "getAssignmentSubject",
            data: {userId : userId,},
            dataType: "json"
        }).done((rply)=>{
            let subjects = ''

            subjects = '<option value="" selected hidden>Select Subject</option>'
            for(list in rply.subjectsList){
                subjects += `<option value="${rply.subjectsList[list].subjectId}">${rply.subjectsList[list].subjectName}</option>`
            }
            $('#ddlSelectedSubjectsListForExam').html(subjects)
        })
    },

    // This Section For Get Chaper
    getSubjectChapter : function () { 
        let subjectId = $('#ddlSelectedSubjectsListForExam').val()

        if (subjectId.trim() === ""){
            return;
        }
        $.ajax({
            type: "post",
            url: url + "getSubjectChapter",
            data: {subjectId: subjectId},
            dataType: "json"
        }).done((rply) => {
           
            if (!rply.status){
                var toastCenter = app.toast.create({
                    text: 'No Chapter Available Right Now',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                return
            }

            let chaptar = ''
            chaptar += '<option value="" selected hidden>Select Chapter</option>'
            for (list in rply.chapterList){
                chaptar += `<option value="${rply.chapterList[list].chapter_id}">${rply.chapterList[list].chapter}</option>`
            }

            $('#ddlSelectedChapterListForExam').html(chaptar)
        })
    },

    // This Section For  Get Exam LIst
    searchExamNow : function () {  
        let subjectId = $('#ddlSelectedSubjectsListForExam').val()
        let chapterId = $('#ddlSelectedChapterListForExam').val()

        if (subjectId.trim() === "" && chapterId.trim() === ""){
            var toastCenter = app.toast.create({
                text: 'No Record Found',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }

        app.preloader.show()
        let assesment = ''
        $.ajax({
            type: "post",
            url: url + "currentAssigment",
            data: { subjectId: subjectId, chapterId: chapterId, userId : userId },
            dataType: 'json'
        }).done(function (rply) {
            if (!rply.success) {
                app.preloader.hide()
                var toastCenter = app.toast.create({
                    text: 'No Exam Found Found',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                return
            }
            for (list in rply.cassment) {
                assesment += `<div class="card demo-facebook-card">`
                assesment += `<div class="card-content card-content-padding">`
                assesment += `<img src="http://guru-siksha.com/uploads/${rply.cassment[list].assmnt_file}" width="100%"/>`
                assesment += `<p><b>${rply.cassment[list].chapter}</b></p>`
                assesment += ` <p class="date">Posted on ${rply.cassment[list].created_date}</p>`
                assesment += `<p>${rply.cassment[list].subject}</p>`
                assesment += `</div>`
                assesment += `<div class="card-footer"><a href="/take-exam/${rply.cassment[list].assmnt_id}/${rply.cassment[list].chapter}" class="link">Take Exam</a></div>`
                assesment += `</div>`
            }
            
            $('#currentAssignmentList').html(assesment)
            $('#filterExamSection').hide()
            $('#currentAssignmentList').show()
            app.preloader.hide()
        })
        
    },

    takeExam: function (examId, examName) {
        let examList = ''
        $.ajax({
            type: "post",
            url: url + "takeExam",
            data: { examId: examId },
            dataType: "json"
        }).done(function (rply) {
            $$('.infinite-scroll-preloader').remove();
            for (list in rply.cassment) {
                examList += `<li>`
                examList += `<a class="item-link smart-select smart-select-init" data-open-in="sheet">`
                examList += `<select name="answer[]">`
                for (newList in rply.cassment[list].opts) {
                    examList += `<option value="${rply.cassment[list].opts[newList].assmnt_id}-${rply.cassment[list].opts[newList].assmnt_q_id}-${rply.cassment[list].opts[newList].options}">${rply.cassment[list].opts[newList].options}</option>`
                }
                examList += `</select>`
                examList += `<div class="item-content">`
                examList += `<div class="item-inner">`
                examList += `<div class="item-title" style="min-width: 0;-webkit-flex-shrink: 1;-ms-flex-negative: 1; flex-shrink: 1; position: relative;white-space: normal;max-width: 100%;">${rply.cassment[list].quest.question}`
                if (rply.cassment[list].quest.q_imge != ""){
                    examList += `<br> <img src="http://guru-siksha.com/uploads/${rply.cassment[list].quest.q_imge}" width="120">` 
                }
                examList += `</div>`
                examList += `</div>`
                examList += `</div>`
                examList += `</a>`
                examList += `</li>`
                $('#lblExamQuistion').html(examList)
            }
        })
    },

    takeExamLazy: function (examId, examName) {
        let examList = ''
        $$('.infinite-scroll-preloader').remove();
        // $.ajax({
        //     type: "post",
        //     url: url + "takeExamLazy",
        //     data: { examId: examId, count: examCount},
        //     dataType: "json"
        // }).done(function (rply) {
        //     if(!rply.success){
        //         $$('.infinite-scroll-preloader').remove();
        //     }
        //     for (list in rply.cassment) {
        //         examCount = parseInt(examCount) + 1
        //         examList += `<li>`
        //         examList += `<a class="item-link smart-select smart-select-init" data-open-in="sheet">`
        //         examList += `<select name="answer[]">`
        //         for (newList in rply.cassment[list].opts) {
        //             examList += `<option value="${rply.cassment[list].opts[newList].assmnt_id}-${rply.cassment[list].opts[newList].assmnt_q_id}-${rply.cassment[list].opts[newList].options}">${rply.cassment[list].opts[newList].options}</option>`
        //         }
        //         examList += `</select>`
        //         examList += `<div class="item-content">`
        //         examList += `<div class="item-inner">`
        //         examList += `<div class="item-title" style="min-width: 0;-webkit-flex-shrink: 1;-ms-flex-negative: 1; flex-shrink: 1; position: relative;white-space: normal;max-width: 100%;">${rply.cassment[list].quest.question}`
        //         if (rply.cassment[list].quest.q_imge != "") {
        //             examList += `<br> <img src="http://guru-siksha.com/uploads/${rply.cassment[list].quest.q_imge}" width="120">`
        //         }
        //         examList += `</div>`
        //         examList += `</div>`
        //         examList += `</div>`
        //         examList += `</a>`
        //         examList += `</li>`
        //     }
        //     $('#lblExamQuistion').append(examList)
        // })
    },

    // testing
    submitResult: function (examId) {
        let values = $("select[name='answer[]']").map(function () { return $(this).val(); }).get()
        $.ajax({
            type: "post",
            url: url + "submitExam",
            data: { answer: values, userId: userId, examId: examId },
            dataType: "json"
        }).done(function (rply) {
            app.dialog.alert(`Your Result ${rply.result}`);
        })
    },


    // This Function For Show Mentor List By Student List
    mentorList: function () {
        let myMentor = ''
        let queryList = ''
        $.ajax({
            type: "post",
            url: url + "myMentors",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            if (rply.success == 1) {
                for (list in rply.mentors) {

                    myMentor += '<li>'
                    myMentor += `<a href="#" class="item-link item-content" onclick="phonegapApp.sendMessagePrompt(${rply.mentors[list].mentor_id})">`
                    if (rply.mentors[list].photo) {
                        myMentor += `<div class="item-media"><img src="http://guru-siksha.com/uploads/mentor/${rply.mentors[list].photo}" width="44" height="44" style="border-radius: 50%" /></div>`
                    }
                    else {
                        myMentor += `<div class="item-media"><img src="img/user.jpg" height="44" style="border-radius: 50%"/></div>`
                    }

                    myMentor += '<div class="item-inner">'
                    myMentor += '<div class="item-title-row">'
                    myMentor += `<div class="item-title">${rply.mentors[list].mentor_name}</div>`
                    myMentor += '</div>'
                    myMentor += `<div class="item-subtitle">${rply.mentors[list].about}</div>`
                    myMentor += '</div>'
                    myMentor += '</a>'
                    myMentor += '</li>'

                    $('#myMentor').html(myMentor)
                    $('#myMentorList').html(myMentor)
                }
                for (list in rply.query) {
                    queryList += `<div class="card">`
                    queryList += `<div class="card-header strong-number">${rply.query[list].message}</div>`
                    if (rply.query[list].reply) {
                        queryList += `<div class="card-content card-content-padding">${rply.query[list].reply}</div>`
                    }
                    else {
                        queryList += `<div class="card-content card-content-padding">Yet to be answerd</div>`
                    }
                    queryList += `<div class="card-footer">By- ${rply.query[list].mentor_name}</div>`
                    queryList += `</div>`
                    $('#myQueryListS').html(queryList)

                }

            }
            //    No mentoor found
            else {

            }
        })
    },


    // This Section For Mentor List For Mentor Rate
    mentorRateList: function () {
        let myMentor = ''
        $.ajax({
            type: "post",
            url: url + "myMentors",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.mentors) {

                myMentor += '<li>'
                myMentor += `<a href="#" class="link sheet-open" href="#" data-sheet=".star-rate" onclick="javascript:localStorage.setItem('mentorIdRate',${rply.mentors[list].mentor_id})">`
                if (rply.mentors[list].photo) {
                    myMentor += `<div class="item-media"><img src="http://guru-siksha.com/uploads/mentor/${rply.mentors[list].photo}" width="44" height="44" style="border-radius: 50%;"  /></div>`
                }
                else {
                    myMentor += `<div class="item-media"><img src="img/user.jpg" width="44" height="44" /></div>`
                }

                myMentor += '<div class="item-inner">'
                myMentor += '<div class="item-title-row">'
                myMentor += `<div class="item-title">${rply.mentors[list].mentor_name}</div>`
                myMentor += '</div>'
                myMentor += `<div class="item-subtitle">${rply.mentors[list].about}</div>`
                myMentor += '</div>'
                myMentor += '</a>'
                myMentor += '</li>'
                $('#myMentorList').html(myMentor)
            }
        })
    },

    // This Section For Rate Mentor
    rateMentor: function (rate) {
        $.ajax({
            type: "post",
            url: url + "mentorRate",
            data: { rate: rate, mentorId: localStorage.getItem('mentorIdRate'), userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            app.dialog.alert('Rete Successfully')
        })
    },


    // This Section For Rate Class 
    rateClass: function (rate) {
        $.ajax({
            type: "post",
            url: url + "courseRate",
            data: { rate: rate, courseId: localStorage.getItem('courseId'), userId: userId, userType: userType },
            dataType: "json"
        }).done(function (rply) {
            app.dialog.alert('Rete Successfully')
        })
    },


    mentorStudentList: function () {
        let myMentor = ''
        let queryList = ''
        $.ajax({
            type: "post",
            url: url + "myStudents",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            if (rply.success == 1) {
                for (list in rply.mentors) {

                    myMentor += '<li>'
                    myMentor += `<a href="#" class="item-link item-content" onclick="phonegapApp.sendMessagePrompt(${rply.mentors[list].mentor_id})">`
                    if (rply.mentors[list].photo) {
                        myMentor += `<div class="item-media"><img src="http://guru-siksha.com/uploads/mentor/${rply.mentors[list].photo}" width="44" /></div>`
                    }
                    else {
                        myMentor += `<div class="item-media"><img src="img/user.jpg" width="44" /></div>`
                    }

                    myMentor += '<div class="item-inner">'
                    myMentor += '<div class="item-title-row">'
                    myMentor += `<div class="item-title">${rply.mentors[list].name}</div>`
                    myMentor += '</div>'
                    myMentor += `<div class="item-subtitle">${rply.mentors[list].subject}</div>`
                    myMentor += '</div>'
                    myMentor += '</a>'
                    myMentor += '</li>'

                    $('#myStudent').html(myMentor)
                }
                for (list in rply.query) {
                    queryList += `<div class="card">`
                    queryList += `<div class="card-header strong-number">${rply.query[list].message}</div>`
                    if (rply.query[list].reply) {
                        queryList += `<div class="card-content card-content-padding">${rply.query[list].reply}</div>`
                    }
                    else {
                        queryList += `<div class="card-content card-content-padding">Yet to be answerd</div>`
                    }
                    queryList += `<div class="card-footer"><a class="link" href="/student-question/${rply.query[list].qid}">Answer Now</a></div>`
                    queryList += `</div>`
                    $('#myQueryListM').html(queryList)

                }

            }
            //    No mentoor found
            else {

            }
        })
    },


    // This Section For Shoq quistions
    studentQuestion: function (qid) {
        $.ajax({
            type: "post",
            url: url + "question",
            data: { qid: qid },
            dataType: "json"
        }).done(function (rply) {
            $('#lblAnswerContent').html(rply.query[0].message)
            $('#txtAnsIdComment').val(qid)
        })
    },


    // This Section For submitAnswer
    questionReply: function () {
        if ($('#txtPostAnswer').val() == "") {
            app.dialog.alert('Please enter your answer')
        }
        else {
            $.ajax({
                type: "post",
                url: url + "questionReply",
                data: { qid: $('#txtAnsIdComment').val(), message: $('#txtPostAnswer').val() },
                dataType: "json"
            }).done(function (rply) {
                if (rply.success == 1)
                    app.dialog.alert('Your Answer Submitted Successfully')
                $('#txtPostAnswer').val('')
            })
        }
    },


    // This Section For Mentor 
    studentMentors: function () {
        let mentorList = ''
        $.ajax({
            type: "post",
            url: url + "mentorList",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            for (list in rply.mentlist) {
                mentorList += `<div class="swiper-slide text-align-center" id="followMentor${rply.mentlist[list].mentors.mentor_id}">`
                if (rply.mentlist[list].mentors.photo != "") {
                    mentorList += `<a href="/user-timeline/${rply.mentlist[list].mentors.mentor_id}/M/"><img src="http://guru-siksha.com/uploads/mentor/${rply.mentlist[list].mentors.photo}" alt="" class="suggestion-user-image"></a><br>`
                }
                else {
                    mentorList += `<a href="/user-timeline/${rply.mentlist[list].mentors.mentor_id}/M/"><img src="img/user.jpg" alt="" class="suggestion-user-image"></a><br>`
                }
                mentorList += `<div class="title module line-clamp" style="font-size:12px;line-height:1;margin-bottom: 5px;">${rply.mentlist[list].mentors.mentor_name}</div>`
                mentorList += `<div class="title module line-clamp" style="font-size:12px;line-height:1;margin-bottom: 5px;"><span class="badge color-orange">★ ${rply.mentlist[list].mrate}</span></div>`
                mentorList += `<div class="row" style="padding: 10px">`
                mentorList += ` <button class="col button button-small button-fill color-blue" style=" font-size: 9px; padding: 0px;width: 100%;" onclick="phonegapApp.submitFollow(${rply.mentlist[list].mentors.mentor_id})">Follow</button>`
                mentorList += `</div>`
                mentorList += `</div>`
                $('#timeLineFollowingHome').show()
                $('#lblMentorListForFollow').html(mentorList)
            }
        })
    },


    // This Section For Mentor 
    submitFollow: function (mentorId) {
        $.ajax({
            type: "post",
            url: url + "submitFollow",
            data: { mentorId: mentorId, userId: userId },
            dataType: "json"
        }).done(function (rply) {
            $('#followMentor' + mentorId).hide()
            phonegapApp.studentMentors()
        })
    },


    // This Section For Mentor Timeline
    mentorTimeline: function () {
        postCountMentor = 0
        $.ajax({
            type: "post",
            url: url + "mentorTimeline",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            let mentorTimeLine = ''
            for (list in rply.allpost) {
                mentorTimeLine += '<div class="card demo-facebook-card">'
                mentorTimeLine += '<div class="card-header">'
                mentorTimeLine += '<div class="demo-facebook-avatar">'
                mentorTimeLine += `<a href="/user-timeline/${rply.allpost[list].postDetailsNEw.user_id}/${rply.allpost[list].postDetailsNEw.user_type}/">`

                if (rply.allpost[list].PostUsers.photo == "")
                    mentorTimeLine += '<img src="img/user.jpg" width="34" height="34">'
                else
                    mentorTimeLine += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allpost[list].PostUsers.photo}" width="34" height="34">`

                mentorTimeLine += ' </div>'
                if (rply.allpost[list].postDetailsNEw.user_type == "M")
                    mentorTimeLine += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.mentor_name}</div>`
                else
                    mentorTimeLine += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.name}</div>`

                mentorTimeLine += `</a>`

                mentorTimeLine += `<div class="demo-facebook-date">${rply.allpost[list].postDetailsNEw.created_date} at ${rply.allpost[list].postDetailsNEw.created_time}</div>`
                mentorTimeLine += '</div>'
                mentorTimeLine += ' <div class="card-content card-content-padding">'
                mentorTimeLine += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="title text-color-black">`
                mentorTimeLine += `<div>${rply.allpost[list].postDetailsNEw.post_content}</div>`
                if (rply.allpost[list].postDetailsNEw.post_image) { 
                    if (rply.allpost[list].postDetailsNEw.file_type == 'pdf'){
                        mentorTimeLine += `<img src="img/pdf.png" class="lazy lazy-fade-in" width="25%" </div>`
                    }
                    if (rply.allpost[list].postDetailsNEw.file_type == 'youtube'){
                        mentorTimeLine += `<img src="${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`
                    }
                    else{
                        mentorTimeLine += `<img src="http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`
                    }
                }

                mentorTimeLine += `<div class="likes">Views: ${rply.allpost[list].totView} &nbsp&nbsp Comments: ${rply.allpost[list].totComnt}</div>`
                mentorTimeLine += '</a>'
                mentorTimeLine += '</div>'
                mentorTimeLine += '<div class="card-footer">'
                if (rply.allpost[list].myLike) {
                    mentorTimeLine += `<a href="#" class="link icon-only text-color-black like" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postDislike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                }
                else {
                    mentorTimeLine += ` <a href="#" class="link icon-only text-color-black" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postLike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons">star_border</i></a>`
                }

                mentorTimeLine += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`

                if (rply.allpost[list].postDetailsNEw.post_image && rply.allpost[list].postDetailsNEw.file_type != "youtube") {
                    mentorTimeLine += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}', 'http://guru-siksha.com//posts/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }
                else {
                    mentorTimeLine += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }


                mentorTimeLine += '</div>'
                mentorTimeLine += '</div>'


                postCountMentor = rply.allpost.length
                $('#timelinePostGurusiksha').html(mentorTimeLine)
            }
        })
    },

    // This Section For User Timeline 
    userTimeLine: function (userId, userType) {
        $.ajax({
            type: "method",
            url: "url",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done((rply) => {

        })
    },


    guardianTimeline: function () {
        $.ajax({
            type: "post",
            url: url + "guardianTimeline",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            let mentorTimeLine = ''
            postCountMentor = 0
            for (list in rply.allpost) {
                mentorTimeLine += '<div class="card demo-facebook-card">'
                mentorTimeLine += '<div class="card-header">'
                mentorTimeLine += '<div class="demo-facebook-avatar">'
                mentorTimeLine += `<a href="/user-timeline/${rply.allpost[list].postDetailsNEw.user_id}/${rply.allpost[list].postDetailsNEw.user_type}/">`

                if (rply.allpost[list].PostUsers.photo == "")
                    mentorTimeLine += '<img src="img/user.jpg" width="34" height="34">'
                else
                    mentorTimeLine += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allpost[list].PostUsers.photo}" class="lazy lazy-fade-in" width="34" height="34">`

                mentorTimeLine += ' </div>'
                if (rply.allpost[list].postDetailsNEw.user_type == "M")
                    mentorTimeLine += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.mentor_name}</div>`
                else
                    mentorTimeLine += `<div class="demo-facebook-name">${rply.allpost[list].PostUsers.name}</div>`
                mentorTimeLine += `</a>`
                mentorTimeLine += `<div class="demo-facebook-date">${rply.allpost[list].postDetailsNEw.created_date} at ${rply.allpost[list].postDetailsNEw.created_time}</div>`
                mentorTimeLine += '</div>'
                mentorTimeLine += ' <div class="card-content card-content-padding">'
                mentorTimeLine += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="title text-color-black">`
                mentorTimeLine += `<div>${rply.allpost[list].postDetailsNEw.post_content}</div>`
                if (rply.allpost[list].postDetailsNEw.post_image) {
                    if(rply.allpost[list].postDetailsNEw.file_type == "pdf")
                    {
                        mentorTimeLine += `<img src="img/pdf.png" class="lazy lazy-fade-in" width="25%" </div>`
                    }
                    else if (rply.allpost[list].postDetailsNEw.file_type == "youtube")
                    {
                        mentorTimeLine += `<img src="${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`
                    }
                    else if (rply.allpost[list].postDetailsNEw.file_type == "image"){
                        mentorTimeLine += `<img src="http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}" class="lazy lazy-fade-in" width="100%" </div>`
                    }
                }

                mentorTimeLine += `<div class="likes">Views: ${rply.allpost[list].totView} &nbsp&nbsp Comments: ${rply.allpost[list].totComnt}</div>`
                mentorTimeLine += '</a>'
                mentorTimeLine += '</div>'
                mentorTimeLine += '<div class="card-footer">'
                if (rply.allpost[list].myLike) {
                    mentorTimeLine += `<a href="#" class="link icon-only text-color-black like" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postDislike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons color-red" >star</i></a>`

                }
                else {
                    mentorTimeLine += ` <a href="#" class="link icon-only text-color-black" id="timepost${rply.allpost[list].postDetailsNEw.post_id}" onclick="phonegapApp.postLike(${rply.allpost[list].postDetailsNEw.post_id},'timepost${rply.allpost[list].postDetailsNEw.post_id}')"><i class="icon material-icons">star_border</i></a>`
                }

                mentorTimeLine += `<a href="/post-details/${rply.allpost[list].postDetailsNEw.post_id}/" class="link icon-only text-color-black"><i class="icon material-icons">comment</i></a>`

                if (rply.allpost[list].postDetailsNEw.post_image && rply.allpost[list].postDetailsNEw.post_image.file_type != "youtube") {
                    mentorTimeLine += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha, ${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, 'http://guru-siksha.com/uploads/posts/${rply.allpost[list].postDetailsNEw.post_image}', 'http://guru-siksha.com//posts/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }
                else {
                    mentorTimeLine += `<a href="#" onclick="window.plugins.socialsharing.share('Gurusiksha', '${rply.allpost[list].postDetailsNEw.post_content.replace(/\s*\n\s*/g," ")}', null, null, 'http://guru-siksha.com/post/${rply.allpost[list].postDetailsNEw.post_id}')" class="link icon-only text-color-black"><i class="icon material-icons">share</i></a>`
                }


                mentorTimeLine += '</div>'
                mentorTimeLine += '</div>'


                postCountMentor = rply.allpost.length
                $('#timelinePostGurusiksha').html(mentorTimeLine)
            }
        })
    },


    // This Section For Mentor Follower List
    mentorFollowList: function () {
        $.ajax({
            type: "post",
            url: url + "mentorFollowList",
            data: { userId: userId },
            dataType: "json"
        }).done(function (rply) {
            let followerList = ''
            for (list in rply.allfollows) {
                followerList += `<div class="row">`
                followerList += `<div class="col-20">`
                if (rply.allfollows[list].photo)
                    followerList += `<img src="http://guru-siksha.com/uploads/mentor/${rply.allfollows[list].photo}" alt="" class="profile-user-image" width="30">`
                else
                    followerList += `<img src="img/user.jpg" alt="" class="profile-user-image" width="30">`
                followerList += `</div>`
                followerList += `<div class="col-80">`
                followerList += `<div class="row strong-number">${rply.allfollows[list].name}</div>`
                followerList += `<div class="row" style="font-size:10px">${rply.allfollows[list].email}</div>`
                followerList += `</div>`
                followerList += `</div>`
                $('#mentorFollowerList').html(followerList)
            }
        })
    },





    // Student Current Class List
    paidClassList: function () {
        let regular = ''
        let demo = ''
        let previous = ''
        $.ajax({
            type: "post",
            url: url + "classDetails",
            data: { userId: userId },
            dataType: "json",
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            },
        }).done(function (rply) {
            console.log(rply)
            for (list in rply.regularClass){
                regular += `<div class="card card-outline">`
                regular += `<div class="card-header text-color-green">#CLASS${rply.regularClass[list].id}</div>`
                regular += `<div class="card-content card-content-padding">`
                regular += `<p>Subject : <span class="text-color-blue">${rply.regularClass[list].subject}</span></p>`
                regular += `<p>Mentor Name : <span class="text-color-blue">${rply.regularClass[list].mentor_name}</span></p>`
                regular += `<p>Class Date : <span class="text-color-blue">${rply.regularClass[list].class_day}</span></p>`
                regular += `<p>Class Day : <span class="text-color-blue">${rply.regularClass[list].class_time}</span></p>`
                regular += `<p>Class Time : <span class="text-color-blue">${rply.regularClass[list].class_time}</span></p>`
                regular += `<p>Class Type : <span class="text-color-blue">REGULAR</span></p>`
                regular += `</div>`
                
                if (rply.regularClass[list].mentor_entry_date !== ""){
                    if (rply.regularClass[list].is_student_accept == 1 && rply.regularClass[list].student_exit_date === ""){
                        regular += `<div class="card-footer">`
                        regular += `<div class="col"><a class="link" onclick="phonegapApp.completeClassStudent(${rply.regularClass[list].schedule_id})">Complete Class</a></div>`
                        regular += `</div>` 
                    }
                    else if (rply.regularClass[list].mentor_entry_date !== "" && rply.regularClass[list].is_student_accept == 0 && rply.regularClass[list].student_exit_date !== ""){
                        regular += `<div class="card-footer">`
                        regular += `<div class="col"><a class="link" onclick="phonegapApp.startClassStudent(${rply.regularClass[list].schedule_id})">Start Class</a></div>`
                        regular += `</div>` 
                    }
                   

                }
                   
                regular += `</div>`    
                regular += `</div>`    

                $('#tabRegularClassList').html(regular)
            }

            for (list in rply.demoClass) {
                demo += `<div class="card card-outline">`
                demo += `<div class="card-header text-color-green">#CLASS${rply.demoClass[list].id}</div>`
                demo += `<div class="card-content card-content-padding">`
                demo += `<p>Subject : <span class="text-color-blue">${rply.demoClass[list].subject}</span></p>`
                demo += `<p>Mentor Name : <span class="text-color-blue">${rply.demoClass[list].mentor_name}</span></p>`
                demo += `<p>Class Date : <span class="text-color-blue">${rply.demoClass[list].class_day}</span></p>`
                demo += `<p>Class Day : <span class="text-color-blue">${rply.demoClass[list].class_time}</span></p>`
                demo += `<p>Class Time : <span class="text-color-blue">${rply.demoClass[list].class_time}</span></p>`
                demo += `<p>Class Type : <span class="text-color-blue">DEMO</span></p>`
                demo += `</div>`

                if (rply.demoClass[list].is_student_accept == 1 && rply.demoClass[list].student_exit_date === "") {
                    demo += `<div class="card-footer">`
                    demo += `<div class="col"><a class="link" onclick="phonegapApp.completeClassStudent(${rply.demoClass[list].schedule_id})">Complete Class</a></div>`
                    demo += `</div>`
                }
                else if (rply.demoClass[list].mentor_entry_date !== "" && rply.demoClass[list].is_student_accept == 0 ) {
                    console.log('Here')
                    demo += `<div class="card-footer">`
                    demo += `<div class="col"><a class="link" onclick="phonegapApp.startClassStudent(${rply.demoClass[list].schedule_id})">Start Class</a></div>`
                    demo += `</div>`
                }
               
                demo += `</div>`
                demo += `</div>`

                $('#tabDemoClassList').html(demo)
            }

            for (list in rply.previousClass) {
                previous += `<div class="card card-outline">`
                previous += `<div class="card-header text-color-green">#CLASS${rply.previousClass[list].id}</div>`
                previous += `<div class="card-content card-content-padding">`
                previous += `<p>Subject : <span class="text-color-blue">${rply.previousClass[list].subject}</span></p>`
                previous += `<p>Mentor Name : <span class="text-color-blue">${rply.previousClass[list].mentor_name}</span></p>`
                previous += `<p>Class Date : <span class="text-color-blue">${rply.previousClass[list].class_day}</span></p>`
                previous += `<p>Class Day : <span class="text-color-blue">${rply.previousClass[list].class_time}</span></p>`
                previous += `<p>Class Time : <span class="text-color-blue">${rply.previousClass[list].class_time}</span></p>`
                previous += `</div>`
                previous += `</div>`
                previous += `</div>`

                $('#tabPreviousClassList').html(previous)
            }
        })
    },



    // Explore List Mentor
    // Student Current Class List
    exploreClass: function () {
        let regular = ''
        let demo = ''
        let previous = ''
        $.ajax({
            type: "post",
            url: url + "exploreClass",
            data: { userId: userId },
            dataType: "json",
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            },
        }).done(function (rply) {
            console.log(rply)
            for (list in rply.regularClass) {
                regular += `<div class="card card-outline">`
                regular += `<div class="card-header text-color-green">#CLASS${rply.regularClass[list].id}</div>`
                regular += `<div class="card-content card-content-padding">`
                regular += `<p>Subject : <span class="text-color-blue">${rply.regularClass[list].subject}</span></p>`
                regular += `<p>Student Name : <span class="text-color-blue">${rply.regularClass[list].name}</span></p>`
                regular += `<p>Class Date : <span class="text-color-blue">${rply.regularClass[list].class_day}</span></p>`
                regular += `<p>Class Day : <span class="text-color-blue">${rply.regularClass[list].class_time}</span></p>`
                regular += `<p>Class Time : <span class="text-color-blue">${rply.regularClass[list].class_time}</span></p>`
                regular += `<p>Class Type : <span class="text-color-blue">REGULAR</span></p>`
                regular += `</div>`
                if (rply.regularClass[list].is_student_accept == 1 && rply.regularClass[list].is_mentor_accept == 0 && rply.regularClass[list].is_complete == 0) {
                    regular += `<div class="card-footer">`
                    regular += `<div class="col"><a class="link" onclick="phonegapApp.completeClass(${rply.regularClass[list].schedule_id})">Complete Class</a></div>`
                    regular += `</div>`
                }
                else if (rply.regularClass[list].mentor_entry_date === "" && rply.regularClass[list].is_mentor_accept == 0) {
                    regular += `<div class="card-footer">`
                    regular += `<div class="col"><a class="link" onclick="phonegapApp.startClass(${rply.regularClass[list].schedule_id})">Start Class</a></div>`
                    regular += `</div>`
                }
                regular += `</div>`
                regular += `</div>`

                $('#tabRegularClassListExplore').html(regular)
            }

            for (list in rply.demoClass) {
                demo += `<div class="card card-outline">`
                demo += `<div class="card-header text-color-green">#CLASS${rply.demoClass[list].id}</div>`
                demo += `<div class="card-content card-content-padding">`
                demo += `<p>Subject : <span class="text-color-blue">${rply.demoClass[list].subject}</span></p>`
                demo += `<p>Student Name : <span class="text-color-blue">${rply.demoClass[list].name}</span></p>`
                demo += `<p>Class Date : <span class="text-color-blue">${rply.demoClass[list].class_day}</span></p>`
                demo += `<p>Class Day : <span class="text-color-blue">${rply.demoClass[list].class_time}</span></p>`
                demo += `<p>Class Time : <span class="text-color-blue">${rply.demoClass[list].class_time}</span></p>`
                demo += `<p>Class Type : <span class="text-color-blue">DEMO</span></p>`
                demo += `</div>`
                demo += `<div class="card-footer">`

                if (rply.demoClass[list].is_student_accept == 1 && rply.demoClass[list].is_mentor_accept == 0 && rply.demoClass[list].is_complete == 0 ) {
                    demo += `<div class="card-footer">`
                    demo += `<div class="col"><a class="link" onclick="phonegapApp.completeClass(${rply.demoClass[list].schedule_id})">Complete Class</a></div>`
                    demo += `</div>`
                }
                else if (rply.demoClass[list].mentor_entry_date === "" && rply.demoClass[list].is_mentor_accept == 0) {
                    demo += `<div class="card-footer">`
                    demo += `<div class="col"><a class="link" onclick="phonegapApp.startClass(${rply.demoClass[list].schedule_id})">Start Class</a></div>`
                    demo += `</div>`
                }

                demo += `</div>`
                demo += `</div>`
                demo += `</div>`

                $('#tabDemoClassListExplore').html(demo)
            }

            for (list in rply.previousClass) {
                previous += `<div class="card card-outline">`
                previous += `<div class="card-header text-color-green">#CLASS${rply.previousClass[list].id}</div>`
                previous += `<div class="card-content card-content-padding">`
                previous += `<p>Subject : <span class="text-color-blue">${rply.previousClass[list].subject}</span></p>`
                previous += `<p>Name : <span class="text-color-blue">${rply.previousClass[list].name}</span></p>`
                previous += `<p>Class Date : <span class="text-color-blue">${rply.previousClass[list].class_day}</span></p>`
                previous += `<p>Class Day : <span class="text-color-blue">${rply.previousClass[list].class_time}</span></p>`
                previous += `<p>Class Time : <span class="text-color-blue">${rply.previousClass[list].class_time}</span></p>`
                previous += `<p>Class Type : <span class="text-color-blue">REGULAR</span></p>`
                previous += `</div>`
                // previous += `<div class="card-footer">`
                // if (rply.previousClass[list].mentor_entry_date === "") {
                //     previous += `<div class="card-footer">`
                //     previous += `<div class="col"><a class="link">Start Class</a></div>`
                // }
                // previous += `</div>`
                previous += `</div>`
                previous += `</div>`

                $('#tabPreviousClassListExplore').html(previous)
            }
        })
    },


    // This Section For Start A Class Mentor
    startClass: function (scheduleId) {  
        $.ajax({
            type: "post",
            url: url + "startMentorClass",
            data: { userId: userId, scheduleId: scheduleId},
            dataType: "json"
        }).done((rply)=>{
            phonegapApp.exploreClass()
        })
    },


    // This Section For Start A Class Student
    startClassStudent: function (scheduleId) {
        $.ajax({
            type: "post",
            url: url + "startStudentClass",
            data: { scheduleId: scheduleId },
            dataType: "json"
        }).done((rply) => {
            phonegapApp.paidClassList()
        })
    },


    // Complete Class Student
    completeClassStudent: function (scheduleId) {
        $.ajax({
            type: "post",
            url: url + "endStudentClass",
            data: { scheduleId: scheduleId },
            dataType: "json"
        }).done((rply) => {
            phonegapApp.paidClassList()
        })
    },


    // Complete Class Mentor
    completeClass: function (scheduleId) {
        $.ajax({
            type: "post",
            url: url + "endMentorClass",
            data: { scheduleId: scheduleId },
            dataType: "json"
        }).done((rply) => {
            phonegapApp.exploreClass()
        })
    },


    // This Section For Complete Class 
    // completeClass: function (id) {
    //     $.ajax({
    //         type: "post",
    //         url: url + "completeClass",
    //         data: { courseId: courseId, userId: userId },
    //         dataType: "json",
    //         beforeSend: function () {
    //             app.preloader.show();
    //         },
    //         complete: function () {
    //             app.preloader.hide();
    //         },
    //     }).done(function (rply) {
    //         if (rply.success) {
    //             app.dialog.alert('Class Complete Successfully')
    //             profileView.router.refreshPage()
    //             phonegapApp.paidClassList()
    //             localStorage.setItem('courseId', courseId)
    //         }

    //     })
    // },


    // This Section For Search Mentor
    searchMentorSearch: function () {
        if ($('#txtSearchMentorList').val().length > 0) {
            $.ajax({
                type: "post",
                url: url + "searchMentorList",
                data: { query: $('#txtSearchMentorList').val(),userId : userId, userType : userType },
                dataType: "json"
            }).done((rply) => {
                $('#lblMentorListSearch').show()
                let mentorSearchList = ''

                for (list in rply.MList) {
                    mentorSearchList += `<a class="text-color-black" href="/assign-mentor/">`
                    mentorSearchList += `<div class="row">`
                    mentorSearchList += `<div class="col-20">`
                    if (rply.MList[list].photo)
                        mentorSearchList += `<img src="http://guru-siksha.com/uploads/mentor/${rply.MList[list].photo}" alt="" class="profile-user-image" width="30">`
                    else
                        mentorSearchList += `<img src="img/user.jpg" alt="" class="profile-user-image" width="30">`
                    mentorSearchList += `</div>`
                    mentorSearchList += `<div class="col-80">`
                    mentorSearchList += `<div class="row strong-number">${rply.MList[list].mentor_name}</div>`
                    mentorSearchList += `<div class="row" style="font-size:10px">${rply.MList[list].about}</div>`
                    mentorSearchList += `</div>`
                    mentorSearchList += `</div>`
                    mentorSearchList += `</a>`
                    $('#mentorSearchResult').html(mentorSearchList)
                }
            })
        }
        else {
            $('#lblMentorListSearch').hide()
        }

    },


    // This Function For Notification 
    getNotification: function () {
        $.ajax({
            type: "post",
            url: url + "getNotification",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done((rply) => {
            let notification = ''

            for (list in rply.notification) {
                notification += `<li>`
                notification += `<div class="item-content">`
                notification += `<div class="item-media">`
                notification += `<div class="item-media"><img src="img/logo.png" width="35" class="profile-user-image"></div>`
                notification += `</div>`
                notification += `<div class="item-inner">`
                notification += `<div class="item-title"><strong>${rply.notification[list].title}</strong>&nbsp;&nbsp;${rply.notification[list].description}</div>`
                notification += `</div>`
                notification += `</div>`
                notification += `</li>`
                $('#lblNotification').html(notification)
            }
            // console.log(rply)
            $('#notificationCount').html(rply.notiCount);
        })
    },


    // This Function For Notification Read
    notificationRead: function () {
        $.ajax({
            type: "post",
            url: url + "notificationRead",
            data: { userId: userId, userType: userType },
            dataType: "json"
        }).done((rply) => {
            $('#notificationCount').html(0);
        })
    },


    // This Section For PDF Upload
    openDocument: function () {
        fileChooser.open({ "mime": "application/pdf" }, (imageURI) => {
            $('#postImagePlace').show()
            $('#deletePostImage').show()
            let image = document.getElementById('postImage')
            image.src = "img/pdf.png"
            $('#txtPostImage').val(imageURI)
            $('#txtPostImagetype').val('pdf')
        }, (err) => {
        })
    },


    // This Section For Youtube Link
    openYoutubeLink : function(){
        app.dialog.prompt('Enter youtube link', function (url) {
            let tempUrl = url.split("/");
            let youtubeImage = 'http://img.youtube.com/vi/' + tempUrl[3] + '/0.jpg'
            $('#postImagePlace').show()
            $('#deletePostImage').show()
            let image = document.getElementById('postImage')
            image.src = youtubeImage
            $('#txtPostImage').val(youtubeImage)
            $('#txtPostImagetype').val('youtube')
            $('#txtYoutubeLink').val(url)
        });
    },


    // This Section For Open PDF File
    openPDFupload: function (url) {
        cordova.InAppBrowser.open(encodeURI(url), '_system', 'location=yes');
    },


    // This function for get day list 
    getDayList : function(){
        $.ajax({
            type: "post",
            url: url + "getAllDays",
            data: {},
            dataType: "JSON"
        }).done((rply) => {
            
            let subjectLst = ''
            subjectLst += `<option value="">Select Subject</option>`
            for (list in rply.subjs) {
                subjectLst += `<option value="${rply.subjs[list].subject_id}">${rply.subjs[list].subject}</option>`
                $('#ddlFilterSubject').html(subjectLst)
            }

            let days = ''
            // This Section For Get Days
            days += `<option value="">Select days</option>`
            for(list in rply.days){
                days += `<option value="${rply.days[list].day_id}">${rply.days[list].day}</option>`
                $('#ddlFilterDays').html(days)
            }


            // This Section For Class
            let classLst = ''
            classLst += `<option value="">Select Class</option>`
            for(list in rply.class){
                classLst += `<option value="${rply.class[list].class_id}">${rply.class[list].class}</option>`
                $('#ddlFilterClass').html(classLst)
            }

            // This Section For Class
            let bordLst = ''
            bordLst += `<option value="">Select Board</option>`
            for (list in rply.board) {
                bordLst += `<option value="${rply.board[list].sub_id}">${rply.board[list].title}</option>`
                $('#ddlFilterBoard').html(bordLst)
            }


        
            
           
        })
    },


    // This Section Filter Mentor
    filterMentor : function(){
        if ($('#ddlFilterSubject').val().trim() != "" && $('#txtFilterArea').val().trim() != "" && $('#ddlFilterClass').val().trim() != "" && $('#ddlFilterBoard').val().trim() != "" && $('#ddlFilterLearning').val().trim() != "")
        {
            $.ajax({
                type: "post",
                url: url + "filterMentor",
                data: { subject: $('#ddlFilterSubject').val(), area: $('#txtFilterArea').val(), class: $('#ddlFilterClass').val(), board: $('#ddlFilterBoard').val(), learning: $('#ddlFilterLearning').val() },
                dataType: "json"
            }).done((rply) => {
                $$('.infinite-scroll-preloader-mentor').hide()
                if (!rply.success) {
                    var toastCenter = app.toast.create({
                        text: 'Sorry No Mentor Found',
                        position: 'center',
                        closeTimeout: 2000,
                    })
                    toastCenter.open()
                    return
                }
                let mentorList = ''
                for (list in rply.times) {
                    mentorList += `<div class="card demo-card-header-pic">`
                    if (rply.times[list].mntor.photo) {

                        if (rply.times[list].mrate.length > 0) {
                            mentorList += `<a href="/user-timeline/${rply.times[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.times[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.times[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.times[list].mrate[0].rate}</span></div></a>`
                        }
                        else {
                            mentorList += `<a href="/user-timeline/${rply.times[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.times[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.times[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i>0.0</span></div></a>`
                        }

                        mentorList += `<div class="card-content card-content-padding">`
                    }
                    else {
                        if (rply.times[list].mrate.length > 0) {
                            mentorList += `<a href="/user-timeline/${rply.times[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.times[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.times[list].mrate[0].rate}</span></div></a>`
                            mentorList += `<div class="card-content card-content-padding">`
                        }
                        else {
                            mentorList += `<a href="/user-timeline/${rply.times[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.times[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> 0.0</span></div></a>`
                            mentorList += `<div class="card-content card-content-padding">`
                        }
                    }

                    mentorList += `<p class="date text-color-blue">${rply.times[list].mntor.about}</p>`
                    mentorList += `<p> Teaching Subject`
                    mentorList += `<ul>`
                    for (subjectList in rply.times[list].msublist) {
                        mentorList += `<li>${rply.times[list].msublist[subjectList].subject}</li>`
                    }
                    mentorList += `</ul>`
                    mentorList += `</p>`
                    mentorList += `</div>`
                    mentorList += `<div class="card-footer"><a onclick="phonegapApp.demoClassData(${rply.times[list].mntor.mentor_id})" class="link">Book Demo Class</a><a onclick="phonegapApp.paidClassData(${rply.times[list].mntor.mentor_id})" class="link">Select Mentor</a></div>`
                    mentorList += `</div>`
                    $('#mentorFilter').html(mentorList);
                }
                app.popup.close('.popup-filter')
                $('#mentorFilter').show();
                $('#mentorSearchListArea').hide()
                $('#btnResetFilter').show()
            });
        }
        else{
            let toastCenter = app.toast.create({
                text: 'Validation Error, You need to fill all the mandatory fields',
                position: 'center',
                closeTimeout: 2000,
            });
            toastCenter.open();
            return
        }
    }, 



    // This Function For Reset Filter
    resetFilter : function(){
        phonegapApp.getDayList()
        phonegapApp.studentMentors()
        app.popup.close('.popup-filter')
        $('#mentorFilter').hide()
        $('#btnResetFilter').hide()
        $('#mentorSearchListArea').show()
    },

    // this function for mentor package
    getPackage : function(mentorId){
        // console.log(mentorId)
       
        localStorage.setItem('tempMentorId', mentorId)
       $.ajax({
           type: "post",
           url: url + "getPackage",
           data: { mentorId: mentorId},
           dataType: "json"
       }).done((rply) => {
           let pkg = ''
           for(list in rply.pack){
               pkg += `<option data-id="${rply.pack[list].price}" value="${rply.pack[list].sub_id}">${rply.pack[list].title}[${rply.pack[list].price}/-]</option>`
            }
           $('#ddlPackagePayment').html(pkg);
        
           let days = ''
           for (let index = 1; index < 31; index++) {
               days += `<option value="${index}">${index} Days</option>`
               $('#ddlDaysPackage').html(days);
           }

           let packageSubject = ''
           for (list in rply.subject){
               packageSubject += `<option value="${rply.subject[list].subject_id}">${rply.subject[list].subject}</option>`  
               $('#ddlPackagePaynmentSelectSubject').html(packageSubject);
           }
       })
    },


    // Calculate Package Value
    packageValue : function(){
        let packageAmount = $('#ddlPackagePayment').find(':selected').attr('data-id')
        let days = $('#ddlDaysPackage').val();
        let hour = $('#ddlHourPackage').val();
        

        let totalAmount = parseInt(packageAmount) * parseInt(days) * parseInt(hour)
        $('#amountPay').html(packageAmount);
        $('#amountDays').html(days);
        $('#amountHour').html(hour);
        $('#amountTotal').html(totalAmount);

        $('#packageMentor').hide();
        $('#amountShow').show();
        // console.log($('#ddlPackagePayment').find(':selected').attr('data-id'))
    },
   

    // This Function For Get Mentor List 
    mentorListSearch : function(){
        mentorCount = 0
        $.ajax({
            type: "post",
            url: url + "searchMentorArea",
            data: {userId : userId, userType : userType},
            dataType: "json"
        }).done((rply) => {
            let mentorList = ''
            for (list in rply.MList){
                mentorCount = parseInt(mentorCount) + 1
                mentorList += `<div class="card demo-card-header-pic">`
                if (rply.MList[list].mntor.photo)
                {   
                    if (rply.MList[list].mrate.length > 0)
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.MList[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.MList[list].mrate[0].rate}</span></div></a>`

                    else
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.MList[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name}</div></a>`

                    mentorList += `<div class="card-content card-content-padding">`
                }
                else{
                    if (rply.MList[list].mrate.length > 0)
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.MList[list].mrate[0].rate}</span></div></a>`

                    else
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name}</div></a>`

                    mentorList += `<div class="card-content card-content-padding">`
                }
                
                mentorList += `<p class="date text-color-blue">${rply.MList[list].mntor.about}</p>`
                mentorList += `<p> Teaching Subject`
                mentorList += `<ul>`
                for (subjectList in rply.MList[list].msublist)
                {
                    mentorList += `<li>${rply.MList[list].msublist[subjectList].subject}</li>`
                }
                mentorList += `</ul>`
                mentorList += `</p>`
                mentorList += `</div>`
                mentorList += `<div class="card-footer"><a onclick="phonegapApp.demoClassData(${rply.MList[list].mntor.mentor_id})" class="link">Book Demo Class</a><a onclick="phonegapApp.paidClassData(${rply.MList[list].mntor.mentor_id})" class="link">Select Mentor</a></div>`
                mentorList += `</div>`
                $('#mentorSearchListArea').html(mentorList);
            }
        })
    },


    // This Function For Get Mentor List Lazzy
    mentorListSearchLazzy : function(){
        $.ajax({
            type: "post",
            url: url + "searchMentorAreaLazy",
            data: { postCount: mentorCount, userId: userId, userType: userType},
            dataType: "json"
        }).done((rply)=>{
            let mentorList = ''
            for (list in rply.MList) {
                mentorCount = parseInt(mentorCount) + 1
                mentorList += `<div class="card demo-card-header-pic">`
                if (rply.MList[list].mntor.photo) {
                    if (rply.MList[list].mrate.length > 0)
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.MList[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.MList[list].mrate[0].rate}</span></div></a>`

                    else
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(http://guru-siksha.com/uploads/mentor/${rply.MList[list].mntor.photo})" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name}</div></a>`

                    mentorList += `<div class="card-content card-content-padding">`
                }
                else {
                    if (rply.MList[list].mrate.length > 0)
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name} <span class="badge color-green" style="font-size: 21px;"><i class="material-icons" style="font-size: 20px;">star</i> ${rply.MList[list].mrate[0].rate}</span></div></a>`

                    else
                        mentorList += `<a href="/user-timeline/${rply.MList[list].mntor.mentor_id}/M/"><div style="background-image:url(img/no-image.png)" class="lazy lazy-fade-in card-header align-items-flex-end" style="font-size: 22px;">${rply.MList[list].mntor.mentor_name}</div></a>`

                    mentorList += `<div class="card-content card-content-padding">`
                }

                mentorList += `<p class="date text-color-blue">${rply.MList[list].mntor.about}</p>`
                mentorList += `<p> Teaching Subject`
                mentorList += `<ul>`
                for (subjectList in rply.MList[list].msublist) {
                    mentorList += `<li>${rply.MList[list].msublist[subjectList].subject}</li>`
                }
                mentorList += `</ul>`
                mentorList += `</p>`
                mentorList += `</div>`
                mentorList += `<div class="card-footer"><a onclick="phonegapApp.demoClassData(${rply.MList[list].mntor.mentor_id})" class="link">Book Demo Class</a><a onclick="phonegapApp.paidClassData(${rply.MList[list].mntor.mentor_id})"  class="link">Select Mentor</a></div>`
                mentorList += `</div>`
                
            }
            $('#mentorSearchListArea').append(mentorList);
        })
    },


    // This Section For Apply Filter
    applyFilter : function() {
        $.ajax({
            type: "post",
            url: url + "url",
            data: "data",
            dataType: "json"
        })
    },


    // This Function For Send Image File Through Chat
    openCameraChat: function () {
        navigator.camera.getPicture((imageData)=>{
            let imagInfo = "data:image/png;base64," + imageData
            $.ajax({
                url: url + 'chat_image',
                method: 'post',
                dataType: 'JSON',
                data: { userId: userId, image: imagInfo, userType: localStorage.getItem('userType'), type: 'image' }
            }).done(function (res) {
                if (res.status) {
                    phonegapApp.getMessage()
                    app.sheet.close('.chat-sheet')
                }
            }).fail()
        }, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        })

    },

    // This Function For Open Gallery
    openGelleryChat: function () {
        navigator.camera.getPicture((imageData)=>{
            let imagInfo = "data:image/png;base64," + imageData
            $.ajax({
                url: url + 'chat_image',
                method: 'post',
                dataType: 'JSON',
                data: { userId: userId, image: imagInfo, userType: localStorage.getItem('userType'),type : 'image' }
            }).done(function (res) {
                if (res.status) {
                    phonegapApp.getMessage()
                    app.sheet.close('.chat-sheet')
                }
            }).fail()
        }, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL
        })
    },


    openDocumentChat: function () {
        fileChooser.open({ "mime": "application/pdf" }, (imageURI) => {
            
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "application/pdf";

            var params = new Object();
            params.type = "pdf";
            params.userType = userType;
            params.userId = userId;

            options.params = params;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(imageURI, url + "chat_image",
                function (result) {
                    
                    app.sheet.close('.chat-sheet')
                    phonegapApp.getMessage()
                },
                function (error) {
                }, options);

            // $('#postImagePlace').show()
            // $('#deletePostImage').show()
            // let image = document.getElementById('postImage')
            // image.src = "img/pdf.png"
            // $('#txtPostImage').val(imageURI)
            // $('#txtPostImagetype').val('pdf')
        }, (err) => {
        })
    },


    // This Section For Get Board And Class List
    getBoardAndClass: function() {
        $.ajax({
            type: "post",
            url: url + "getBoardAndClass",
            data: {userId : userId},
            dataType: "JSON"
        }).done((rply) => {
            let board = ''
            let classLsit = ''

            board += `<option value="" selected hidden>Select Board</option>`
            for (list in rply.boardList){
                board += `<option value="${rply.boardList[list].sub_id}">${rply.boardList[list].title}</option>`
                $('#ddlMentorSelectedBoardList').html(board)
            }
            


            classLsit += `<option value="" selected hidden>Select Class</option>`
            for (list in rply.classList) {
                classLsit += `<option value="${rply.classList[list].class_id}">${rply.classList[list].class}</option>`
                $('#ddlMentorSelectedClassList').html(classLsit)
            }


            
            let locationList = ''
            for (list in rply.mentorBoardClassList) {
                locationList += `<li id="mentorBoardClassItem${rply.mentorBoardClassList[list].uid}"><a href="#" onclick="phonegapApp.deleteMentorBoardClass(${rply.mentorBoardClassList[list].uid})" class="item-link item-content">`
                locationList += `<div class="item-inner">`
                locationList += `<div class="item-title"><strong>${rply.mentorBoardClassList[list].board}</strong>, <strong>${rply.mentorBoardClassList[list].class}</strong></div>`
                locationList += `<div class="item-after"><i class="material-icons md-only icon color-red">delete_forever</i></div>`
                locationList += `</div>`
                locationList += ` </a></li>`
                $('#listMentroBoardClass').html(locationList)
            }
            
            
           

        })
    },

    // This Section For Mentor Board Class List 
    deleteMentorBoardClass : function(uid){
        app.dialog.confirm('Are you sure to delete?', function () {
            $.ajax({
                type: "post",
                url: url + "deleteMentorBoardClass",
                data: { uid: uid },
                dataType: "json"
            }).done((rply) => {
                $('#mentorBoardClassItem' + uid).hide()
                let toastCenter = app.toast.create({
                    text: 'Record Deleted',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()

            })
        })
    },


    // This function for mentor board and class
    submitMentorClassBoard : function(){ 
        if (app.input.validate('#ddlMentorSelectedBoardList') && app.input.validate('#ddlMentorSelectedBoardList')){
            let toastCenter = app.toast.create({
                text: 'Validation Error',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            return
        }

        $.ajax({
            type: "post",
            url: url + "submitMentorClassBoard",
            data: { userId: userId, userType: userType, board: $('#ddlMentorSelectedBoardList').val(), class: $('#ddlMentorSelectedBoardList').val()},
            dataType: "json"
        }).done((rply) => {
            let toastCenter = app.toast.create({
                text: 'Class And Board Save Successfully',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            phonegapApp.getBoardAndClass()
        })
    },


    // This Section For Load Data Demo Class
    demoClassData : function(mentorId){
        $('#select-mentor-demo-image').attr('src', `img/user.jpg`)
        $('#select-mentor-demo-charge').html("0")
        $("#ddlpaidClassNumberOfClass").prop('selectedIndex', 0)
        $("#ddlpaidClassHours").prop('selectedIndex', 0)
        app.preloader.show()
        $.ajax({
            type: "post",
            url: url + "mentorSelectedDayTimeSubject",
            data: { mentorId: mentorId},
            dataType: "json"
        }).done((rply)=>{
            // console.log(rply)
            $('#select-mentor-demo-fullname').html(rply.mentorData[0].mentor_name)
            $('#select-mentor-demo-tutiontype').html(rply.mentorData[0].teachingType)
            if(rply.mentorData[0].teachingType == "Online" ){
                $('#demo-class-landmark').hide()
                $('#demo-class-address').hide()
                $('#demo-class-landmark').val('Online Class')
                $('#demo-class-address').val('Online Class')
            }
            else{
                $('#demo-class-landmark').show()
                $('#demo-class-address').show()
                $('#demo-class-landmark').val('')
                $('#demo-class-address').val('')
            }
            if (rply.package.length)
                $('#select-mentor-demo-charge').html(rply.package[0].price)
            // Mentor Image
            if (rply.mentorData[0].photo)
                $('#select-mentor-demo-image').attr('src', `http://guru-siksha.com/uploads/mentor/${rply.mentorData[0].photo}`)

            let demoClassSubject = ''
            demoClassSubject += `<option value="" selected>Select Subject</option>`
            for (list in rply.mentorSubjects) {
                demoClassSubject += `<option value='${rply.mentorSubjects[list].subject_id}'>${rply.mentorSubjects[list].subject}</option>`
                $('#ddlDemoClassSubject').html(demoClassSubject)
            }
            $('#mentorSelectionPaymentAmount').html(rply.mentorData[0].demo_class_rate)
        })
        $('#btnpayForDemoClass').attr('onclick', `phonegapApp.payForDemoClass(${mentorId})`)
        
        app.preloader.hide()
        app.popup.open('.popup-democlass')
    },


    // this function for book demo class 
    payForDemoClass: function (mentorId){
        let mode = $('#select-mentor-demo-tutiontype').html()
        if (mode == "") {
            mode = "Offline"
        }

        if(mode == "Offline")
        {
            if ($('#ddlDemoClassSubject').val() != "" && $('#txtDemoClassRegisterAddress').val() != "" && $('#txtDemoClassLandmark').val() != "") {
                app.dialog.confirm('<p>Startup fees :- 100/rs</p><p><b>DEMO CLASS IS TOTALLY FREE</b></p><p>Rs.100/- paid at the time of booking will be adjusted in next paid classes</p><p>After clicking on submit button you are agreeing with our T&C</p>', function () {
                    $.ajax({
                        type: "post",
                        url: url + "payForDemoClass",
                        data: { userId: userId, mentorId: mentorId, subject: $('#ddlDemoClassSubject').val(), mode: $('#ddlDemoClassTeachingType').val(), registerAddress: $('#txtDemoClassRegisterAddress').val(), landmark: $('#txtDemoClassLandmark').val(), type: 'DEMO', numClass: 1, hours: 1, total_price: 100, price: 100, modeOfTution: mode },
                        dataType: "json"
                    }).done((rply) => {
                        let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');
                        ref.addEventListener('loadstop', function (event) {
                            let urlSuccessPage = "http://www.guru-siksha.com/success.php";
                            let urlErrorPage = "http://www.guru-siksha.com/fail.php";
                            if (event.url == urlSuccessPage) {
                                ref.close()
                                $.ajax({
                                    type: "post",
                                    url: url + "demoClassSuccessPay/",
                                    data: { ordrId: rply.oid },
                                    dataType: "JSON"
                                })
                                app.dialog.alert('Mentor Select Successfully')

                            }
                            else if (event.url == urlErrorPage) {
                                ref.close()
                                app.dialog.alert('Payment Not Done')
                            }
                        });

                    })
                })


            }
            else {
                var toastCenter = app.toast.create({
                    text: 'Validation Error',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                return
            } 
        }
        else{
            if ($('#ddlDemoClassSubject').val() != "") {
                app.dialog.confirm('<p>Term and condition for demo class booking</p><p>Startup fees :- 100/rs</p><p><b>DEMO CLASS IS TOTALLY FREE</b></p><p>100rs payed at the time of demo booking will be adjusted in next  paid classes.</p><p>3 demo classes will be provided by GURUSIKSHA. 2 demos are totally free, if student will opt for 3rd demo 100/- rs will not be refunded & nor adjusted. </p><p>After demo class if student don’t want to continue then 100/- rs will be refunded in their account only.</p><p>For any more info :- mail us :- INFO@GURUSIKSHA.COM </p>', function () {
                    $.ajax({
                        type: "post",
                        url: url + "payForDemoClass",
                        data: { userId: userId, mentorId: mentorId, subject: $('#ddlDemoClassSubject').val(), mode: $('#ddlDemoClassTeachingType').val(), registerAddress: $('#txtDemoClassRegisterAddress').val(), landmark: $('#txtDemoClassLandmark').val(), type: 'DEMO', numClass: 1, hours: 1, total_price: 100, price: 100, modeOfTution: mode },
                        dataType: "json"
                    }).done((rply) => {
                        let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');
                        ref.addEventListener('loadstop', function (event) {
                            let urlSuccessPage = "http://www.guru-siksha.com/success.php";
                            let urlErrorPage = "http://www.guru-siksha.com/fail.php";
                            if (event.url == urlSuccessPage) {
                                ref.close()
                                $.ajax({
                                    type: "post",
                                    url: url + "demoClassSuccessPay/",
                                    data: { ordrId: rply.oid },
                                    dataType: "JSON"
                                })
                                app.dialog.alert('Mentor Select Successfully')

                            }
                            else if (event.url == urlErrorPage) {
                                ref.close()
                                app.dialog.alert('Payment Not Done')
                            }
                        });

                    })
                })
            }

        }
        

    },

    // UpdatePaymentStatus
    updatePaymentStatus : function(orderId){
        $.ajax({
            type: "post",
            url: url + "demoClassSuccessPay",
            data: { ordrId: orderId},
            dataType: "json"
        }).done((rply)=>{
            console.log(rply)
        })
    },

    
    // This Section For Load Data Paid Class
    paidClassData: function (mentorId) {
        $('#select-mentor-image').attr('src', `img/user.jpg`)
        $('#select-mentor-charge').html("0")
        $("#ddlpaidClassNumberOfClass").prop('selectedIndex', 0)
        $("#ddlpaidClassHours").prop('selectedIndex', 0)
        app.preloader.show()
        $.ajax({
            type: "post",
            url: url + "mentorSelectedDayTimeSubject",
            data: { mentorId: mentorId },
            dataType: "json"
        }).done((rply) => {
            console.log(rply)
            // console.log(rply)
            // let democlassDay = ''
            // let democlassTime = ''
            let demoClassSubject = ''
            let demoClassPackage = ''
            $('#select-mentor-fullname').html(rply.mentorData[0].mentor_name)
            $('#select-mentor-tutiontype').html(rply.mentorData[0].teachingType)
            if (rply.mentorData[0].teachingType == "Online") {
                $('#paid-class-landmark').hide()
                $('#paid-class-address').hide()
                $('#paid-class-landmark').val('Online Class')
                $('#paid-class-address').val('Online Class')
            }
            else{
                $('#paid-class-landmark').show()
                $('#paid-class-address').show()
                $('#paid-class-landmark').val('')
                $('#paid-class-address').val('')
            }
            // Mentor Price
            if (rply.package.length)
                $('#select-mentor-charge').html(rply.package[0].price)
            // Mentor Image
            if (rply.mentorData[0].photo)
                $('#select-mentor-image').attr('src', `http://guru-siksha.com/uploads/mentor/${rply.mentorData[0].photo}`)


            demoClassSubject += `<option value="" selected>Select Subject</option>`
            for (list in rply.mentorSubjects) {
                demoClassSubject += `<option value='${rply.mentorSubjects[list].subject_id}'>${rply.mentorSubjects[list].subject}</option>`
                $('#ddlpaidClassSubject').html(demoClassSubject)
            }
        })
        $('#btnpayForPaidClass').attr('onclick', `phonegapApp.payForpaidClass(${mentorId})`)

        app.preloader.hide()
        app.popup.open('.popup-paidClass')
    },


    // Calculate Payment
    calulatePayment : function(){
        let hours = $('#ddlpaidClassHours').val()
        let numberOfClass = $('#ddlpaidClassNumberOfClass').val()
        let pcakagePrice = $('#select-mentor-charge').html()

        if (hours != "" && numberOfClass != ""){
            totalAmount = parseInt(hours) * parseInt(numberOfClass) * parseInt(pcakagePrice)
            $("#btnpayForPaidClass").html(`Pay ${totalAmount} & Book`)
        }
    },

    // this section for book paid class
    payForpaidClass: function (mentorId){
        if ($('#ddlpaidClassSubject').val() != "" && $('#txtpaidClassRegisterAddress').val() != "" && $('#txtpaidClassLandmark').val() != "" && $('#txtpaidClassLandmark').val() != "" && $('#ddlpaidClassHours').val() != "" && $('#ddlpaidClassNumberOfClass').val() != "") {
            // let pcakagePrice = $('#select-mentor-charge').html()
            $.ajax({
                type: "post",
                url: url + "payForDemoClass",
                data: { userId: userId, mentorId: mentorId, subject: $('#ddlpaidClassSubject').val(), numClass: $('#ddlpaidClassNumberOfClass').val(), hours: $('#ddlpaidClassHours').val(), registerAddress: $('#txtpaidClassRegisterAddress').val(), landmark: $('#txtpaidClassLandmark').val(), type: 'REGULAR', total_price: totalAmount, price: $('#select-mentor-charge').html(), modeOfTution: $('#select-mentor-tutiontype').html() },
                dataType: "json"
            }).done((rply) => {
                let ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');
                ref.addEventListener('loadstop', function (event) {
                    let urlSuccessPage = "http://www.guru-siksha.com/success.php";
                    let urlErrorPage = "http://www.guru-siksha.com/fail.php";
                    if (event.url == urlSuccessPage) {
                        ref.close()
                        $.ajax({
                            type: "post",
                            url: url + "demoClassSuccessPay/",
                            data: { ordrId: rply.oid },
                            dataType: "JSON"
                        })
                        app.dialog.alert('Mentor Select Successfully')

                    }
                    else if (event.url == urlErrorPage) {
                        ref.close()
                        app.dialog.alert('Payment Not Done')
                    }
                });

            })


        }
        else {
            var toastCenter = app.toast.create({
                text: 'Validation Error',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }

    },


    // This Section For Mentor Subject Seclection
    mentorSubjectList : function(){
        $.ajax({
            type: "post",
            url: url + "mentorSubjectList",
            data: {userId : userId},
            dataType: "json"
        }).done((rply) => {
            let subjects = ''
            for (list in rply.subjectList) 
            {
                subjects += `<option value=${rply.subjectList[list].sub_id}>${rply.subjectList[list].title}</option>`
                $('#ddlSubjectsForMentors').html(subjects)
            }
            
            let subjectList = ''
            for (list in rply.subjectHistory) {
                subjectList += `<li><a href="#" onclick="phonegapApp.deleteMentorSubjectList(${rply.subjectHistory[list].recordId})" class="item-link item-content">`
                subjectList += `<div class="item-inner">`
                subjectList += `<div class="item-title"><strong>${rply.subjectHistory[list].sunjectName}</strong></div>`
                subjectList += `<div class="item-after"><i class="material-icons md-only icon color-red">delete_forever</i></div>`
                subjectList += `</div>`
                subjectList += ` </a></li>`
                $('#listMentroSubjectList').html(subjectList);
            }
        })
    },


    // This Section For Mentor Area Submit 
    submitMentorSubject: function () {

        if ($('#ddlSubjectsForMentors').val().length != 0) {
            $.ajax({
                type: "post",
                url: url + "submitMentorSubject",
                data: { userId: userId, locations: $('#ddlSubjectsForMentors').val() },
                dataType: "json"
            }).done((rply) => {
                let toastCenter = app.toast.create({
                    text: 'Subject Add Successfully',
                    position: 'center',
                    closeTimeout: 2000,
                })
                toastCenter.open()
                app.smartSelect.destroy('#ddlSubjectsForMentors')
                phonegapApp.mentorSubjectList()
            })
        }
        else {
            console.log('Empty')
        }

    },


    // This Section For Delete Subject 
    deleteMentorSubjectList  : function(recordId) {
        $.ajax({
            type: "post",
            url: url + "deleteMentorSubjectList",
            data: { recordId: recordId},
            dataType: "json"
        }).done((rply) => {
            let toastCenter = app.toast.create({
                text: 'Subject Deleted',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
            phonegapApp.mentorSubjectList()
        })
    }

}


// Back Button Implimentation
function onBackKeyDown() {
    if (app.views["current"].router.history.length == 1 && app.views["current"].selector != "#view-home") {
        app.tab.show('#view-home')
    }
    else if (app.views["current"].router.history.length > 1) {
        app.views["current"].router.back()
    }
    else if (app.views["current"].selector == "#view-home") {
        app.dialog.confirm('Are you sure you want to exit?', function () {
            navigator.app.exitApp()
        })
    }
}

function onSuccess(imageData) {
    let imagInfo = "data:image/png;base64," + imageData
    $("#profile_image").attr("src", imageData)
    var toastCenter = app.toast.create({
        text: 'Uploading...',
        position: 'center',
        closeTimeout: 2000,
    })
    toastCenter.open()
    app.preloader.show()
    $.ajax({
        url: url + 'apply_image',
        method: 'post',
        dataType: 'JSON',
        data: { userId: userId, image: imagInfo, userType: localStorage.getItem('userType') }
    }).done(function (res) {
        if (res.status) {
            $('#lblUserImage').attr('src', 'http://guru-siksha.com/uploads/mentor/' + res.img)
            $('#editMentorPhoto').attr('src', 'http://guru-siksha.com/uploads/mentor/' + res.img)

            userImage = 'http://guru-siksha.com/uploads/mentor/' + res.img;
            app.preloader.hide()
            var toastCenter = app.toast.create({
                text: 'Image Update Successfully',
                position: 'center',
                closeTimeout: 2000,
            })
            toastCenter.open()
        }
    }).fail()
}
function onAssignmentSuccess(imageData) {
    let imagInfo = "data:image/jpeg;base64," + imageData
    $('#txtImageFileForAssignment').val(imagInfo);
    $('#txtImageFileForAssignmentType').val('img')
}

function onFail(message) {
    console.log('Failed because: ' + message)
}

// Picture For Post
function onPostSuccess(imageData) {
    $('#postImagePlace').show()
    $('#deletePostImage').show()
    let image = document.getElementById('postImage')
    image.src = "data:image/jpeg;base64," + imageData
    $('#txtPostImagetype').val('Image')
    $('#txtPostImage').val("data:image/jpeg;base64," + imageData)
    

}

var $ptrContent = $$('.ptr-content')
$ptrContent.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
        // if (userType == "S") {
        //     phonegapApp.studentTimeline()
        // }
        // app.views["current"].router.refreshPage()
        // // When loading done, we need to reset it
        window.location.href = "index.html"
        app.ptr.done() // or e.detail()
    }, 2000)
})


var allowInfinite = true
var lastItemIndex = $$('.ptr-content-home div').length
var maxItems = 200
var itemsPerLoad = 20

$$('.infinite-scroll-content-home').on('infinite', function () {
    if (!allowInfinite) return
    allowInfinite = false
    setTimeout(function () {
        allowInfinite = true
        phonegapApp.timelineNextPost()
        $$('.infinite-scroll-preloader-home').remove()
        lastItemIndex = $$('.ptr-content-home div').length
       
    }, 1000)
    allowInfinite = false
    return
});



// This Function for Open App 
function handleOpenURL(url) {
    console.log("received url: " + url);

}


