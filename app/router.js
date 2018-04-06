var appRouter = function(app) {
  // WEB =====================================================================
  app.get('*', function(request, response) {
      response.sendFile(__base + '/public/index.html');
  });
}

module.exports = appRouter;
