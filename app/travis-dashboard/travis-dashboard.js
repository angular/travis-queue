'use strict';

angular.module('TravisQueueDashboard').
directive('travisDashboard', function() {
  return {
    scope: {},
    templateUrl: 'travis-dashboard/travis-dashboard.html',
    controllerAs: 'self',
    controller: ['travisApi', function TravisDashboard(travisApi) {
      var self = this;
      var builds = self.builds = [];
      var jobs = self.jobs = [];
      self.jobsStarted = 0;

      travisApi.getActiveRepos().
          then(function(repos) {

            self.repos = repos;
            var loadingRepos = self.loadingRepos = repos.slice(0);
            var loadingBuilds = self.loadingBuilds = [];

            repos.forEach(function(repo) {

              travisApi.getActiveBuildsForRepo(repo).then(function(repoBuilds) {

                loadingRepos.splice(loadingRepos.indexOf(repo.slug), 1);
                repoBuilds.forEach(function(build) {
                  builds.push(build);
                  loadingBuilds.push(build);

                  travisApi.getActiveJobsForBuild(build).then(function(activeJobs) {
                    loadingBuilds.splice(loadingBuilds.indexOf(build), 1);
                    activeJobs.forEach(function(job) {
                      jobs.push(job);
                      if (jobs.state = 'started') {
                        self.jobsStarted++;
                      }
                    });
                  });
                });

              });

            });
          });
    }]
  };
});
