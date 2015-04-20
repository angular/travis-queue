angular.module('TravisQueueDashboard').
service('travisApi', ['$http', '$q', function TravisApi($http, $q) {

  var AUTH_TOKEN = 'token IBrT_JxlJaC9WKhRck0MEw';
  var API_V2_MIMETYPE = 'application/json; version=2';


  this.getActiveRepos = function() {
    return $http.get('https://api.travis-ci.org/v3/repos',
        {headers: {'Authorization': AUTH_TOKEN}}).
        then(function (response) {
          return self.repos = response.data.repositories.filter(function (repo) {
            return (repo.active && repo.owner.login === 'angular');
          });
        });
  };


  this.getActiveBuildsForRepo = function(repo) {
    return $http.get('https://api.travis-ci.org/repos/' + repo.slug + '/builds',
        {headers: {'Authorization': AUTH_TOKEN, 'Accept': API_V2_MIMETYPE}}).
        then(function(response) {

          var commits = {};
          response.data.commits.forEach(function(commit) {
            commits[commit.id] = commit;
          });

          return response.data.builds.filter(function(build) {
            build.commit = commits[build.commit_id];
            build.repo = repo;
            build.jobCountTotal = build.job_ids.length;
            return {passed: false, failed: false, errored: false, canceled: false}[build.state] === undefined;
            //v1: created -> started -> received -> (passed|failed|errored|canceled) // possibly more
          });
        });
  };


  this.getActiveJobsForBuild = function(build) {
    return $q.all(build.job_ids.map(function(jobId) {
      return $http.get('https://api.travis-ci.org/jobs/' + jobId,
          {headers: {'Authorization': AUTH_TOKEN, 'Accept': API_V2_MIMETYPE}}).
          then(function (response) {
            return response.data;
          });
    })).then(function(payloads) {
      return payloads.filter(function(payload) {
        return {passed: false, failed: false, errored: false, canceled: false}[payload.job.state] === undefined
      }).map(function(activePayload) {
        var job = activePayload.job;
        job.commit = activePayload.commit;
        job.build = build;
        build.jobCountActive = build.jobCountActive ? build.jobCountActive + 1 : 1;
        return job;
      });
    });
  };
}]);