/**
 * Simple service for generating personalized greetings.
 */
angular.module('form2Module')
  .service('greetingService', function() {
    
    /**
     * Gets the current time period for time-based greetings
     */
    this.getCurrentTimePeriod = function() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Good morning';
      if (hour >= 12 && hour < 17) return 'Good afternoon';
      if (hour >= 17 && hour < 22) return 'Good evening';
      return 'Good night';
    };

    /**
     * Generates a simple personalized greeting
     */
    this.generateGreeting = function(userName) {
      if (!userName || userName.trim() === '') {
        return '';
      }

      const timeGreeting = this.getCurrentTimePeriod();
      return `${timeGreeting}, ${userName.trim()}! Welcome to our platform.`;
    };
  });