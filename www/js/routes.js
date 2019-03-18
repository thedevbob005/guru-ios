routes = [
  {
    path: '/',
    // url: './index.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        if (userType == "S") {
          phonegapApp.userDetails(user)
          phonegapApp.studentTimeline()
          phonegapApp.mentorListSearch()
          phonegapApp.studentMentors()
          phonegapApp.getDayList()
        }
        else if (userType == "M") {
          phonegapApp.userDetails(user)
          phonegapApp.mentorTimeline()
          phonegapApp.getDayList()
        }
        else {
          phonegapApp.userDetails(user)
          phonegapApp.guardianTimeline()
          phonegapApp.mentorListSearch()
        }
        app.preloader.hide();
        resolve(
          {
            url: './index.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/terms/',
    url: './pages/terms.html',
  },
  {
    path: '/privacy/',
    url: './pages/privacy.html',
  },
  {
    path: '/how-it-works/',
    url: './pages/how-it-works.html',
  },
  {
    path: '/contact-us/',
    url: './pages/contact-us.html',
  },
  {
    path: '/enquiry/',
    url: './pages/enquiry.html',
  },
  {
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // User Profile
  {
    path: '/profile/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.userDetails(user)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/profile.html',
          },
        );
      }, 1000);
    },
  },

  // User Post
  {
    path: '/explore/',
    componentUrl: './pages/explore.html',
  },

  // User Post
  {
    path: '/create-post/',
    componentUrl: './pages/create-post.html',
  },

  // User Post Home
  {
    path: '/create-post/',
    componentUrl: './pages/create-post.html',
  },

  

  // User Post Home
  {
    path: '/create-post-home/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/create-post-home.html',
          },
        );
      }, 1000);
    },
  },


  // Another User Profile View
  {
    path: '/user-timeline/:userId/:userType/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      let userId = routeTo.params.userId;
      let userType = routeTo.params.userType;
      setTimeout(function () {
        phonegapApp.viewUserProfile(userId, userType)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/user-profile.html',
          },
        );
      }, 1000);
    },
  },


  // Offer Subject List
  {
    path: '/offer-subject/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.offerSubjects()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/offer-subject.html',
          },
        );
      }, 1000);
    },
  },


  // This Section For Send Assignment For Students
  {
    path: '/send-assignment/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorAssignmnetSubmit()
        phonegapApp.getMentorAssignment()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/send-assignment.html',
          },
        );
      }, 1000);
    },
  },

  // This Section For View Student Current Assignment
  // This Section For Send Assignment For Students
  {
    path: '/student-assignment/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        
        phonegapApp.getStudentAssignment()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/student-assignment.html',
          },
          app.toolbar.hide('.tabbar')
        );
      }, 1000);
    },
  },



  //  Class Details
  {
    path: '/class-details/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.paidClassList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/class-details.html',
          },
        );
      }, 1000);
    },
  },

  // Edit Profile Mentor
  {
    path: '/edit-profile-mentor/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.userDetails(user)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/edit-mentor.html',
          },
        );
      }, 1000);
    },
  },

  // Edit Profile User
  {
    path: '/edit-profile-user/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      
      setTimeout(function () {
        phonegapApp.getStudentDataForEdit()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/edit-profile.html',
          },
        );
      }, 1000);
    },
  },


  // Assign Mentor
  {
    path: '/assign-mentor/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();

      setTimeout(function () {
        phonegapApp.getAssignDetails()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/assign-mentor.html',
          },
        );
      }, 4000);
    },
  },

  // Chat Listing
  {
    path: '/chat-listing/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.getLastChat()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/chat-listing.html',
          },
        );
      }, 1000);
    },
  },

  // Mentor Time Table Assign
  {
    path: '/mentor-class-time/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorSelectedSubject()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/mentor-timeing.html',
          },
        );
      }, 1000);
    },
  },


  // This Function For Get Package 
  {
    path: '/select-package/:mentorId',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      let mentorId = routeTo.params.mentorId;
      // console.log(mentorId)
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.getPackage(mentorId)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/package.html',
          },
        );
      }, 1000);
    },
  },

  {
    path: '/wish-to-relocate/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      let mentorId = routeTo.params.mentorId;
      // console.log(mentorId)
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorRelocation()
        phonegapApp.mentorSelectedLocation()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/wish-to-relocate.html',
          },
        );
      }, 1000);
    },
  },

  {
    path: '/mentor-subjects/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      // console.log(mentorId)
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorSubjectList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/mentor-subjects.html',
          },
        );
      }, 1000);
    },
  },
  {
    path: '/board-and-class/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      let mentorId = routeTo.params.mentorId;
      // console.log(mentorId)
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.getBoardAndClass()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/board-and-class.html',
          },
        );
      }, 1000);
    },
  },
  // Mentor Time 
  // {
  //   path: '/mentor-timeing/',
  //   async: function (routeTo, routeFrom, resolve, reject) {
  //     var router = this;
  //     var app = router.app;
  //     app.preloader.show();
  //     setTimeout(function () {
  //       phonegapApp.mentorSelectedSubject()
  //       app.preloader.hide();
  //       resolve(
  //         {
  //           componentUrl: './pages/mentor-timeing.html',
  //         },
  //       );
  //     }, 1000);
  //   },
  // },

  // Chat
  {
    path: '/chat/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.getMessage()
        app.toolbar.hide('.main-navigation')
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/chat.html',
          },
        );
      }, 1000);
    },
  },
  //  Change Teachers Section 
  {
    path: '/teacher-change-page/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/teacher-change-page.html',
          },
        );
      }, 1000);
    },
  },
  // User Profile
  {
    path: '/user-profile/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/user-profile.html',
          },
        );
      }, 1000);
    },
  },
  // Saved Posts
  {
    path: '/saved-posts/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.saveContent()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/saved-posts.html',
          },
        );
      }, 1000);
    },
  },
  // Post Details 
  {
    path: '/post-details/:postId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      var postId = routeTo.params.postId;
      app.preloader.show();
      setTimeout(function () {
        app.toolbar.hide('.main-navigation')
        // console.log(postId)
        phonegapApp.postDetails(postId)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/post-details.html',
          },
        );
      }, 1000);
    },
  },
  // Current Assigment
  {
    path: '/current-assigment/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        app.toolbar.hide('.tabbar')
        phonegapApp.currentAssigment()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/current-assigment.html',
          },
        );
      }, 1000);
    },
  },
  // Give Exam
  {
    path: '/take-exam/:examId/:examName',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      var examId = routeTo.params.examId;
      var examName = routeTo.params.examName;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.takeExam(examId, examName)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/take-exam.html',
          },
        );
      }, 1000);
    },
  },
  // Progress Report
  {
    path: '/progress-report/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/progress-report.html',
          },
        );
      }, 1000);
    },
  },
  // Special Query
  {
    path: '/special-query/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/special-query.html',
          },
        );
      }, 1000);
    },
  },
 // Mentor Rate
  {
    path: '/mentor-rate/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorRateList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/mentor-rate.html',
          },
        );
      }, 1000);
    },
  },
  // This Section For Student List 
  {
    path: '/student-list/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        phonegapApp.mentorStudentList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/student-list.html',
          },
        );
      }, 1000);
    },
  },

  // This Quistion Details
  {
    path: '/student-question/:qid',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      var qid = routeTo.params.qid;
      app.preloader.show();
      setTimeout(function () {
        app.toolbar.hide('.main-navigation')
        phonegapApp.studentQuestion(qid)
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/student-quistion-details.html',
          },
        );
      }, 1000);
    },
  },

  // This Function For Mentor Followers
  {
    path: '/mentor-follower/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {
        app.toolbar.hide('.main-navigation')
        phonegapApp.mentorFollowList()
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/mentor-follower.html',
          },
        );
      }, 1000);
    },
  },

  // This Route For User Settings
  {
    path: '/user-settings/',
    url: './pages/user-settings.html',
  },
  // Block List
  {
    path: '/block-list/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      setTimeout(function () {

        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/block-list.html',
          },
        );
      }, 1000);
    },
  },
  // This Route For Password Change
  {
    path: '/password-change/',
    url: './pages/password-change.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
