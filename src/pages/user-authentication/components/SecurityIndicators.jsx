import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-8 space-y-4">
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs">SSL Secured</span>
        </div>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-xs">256-bit Encryption</span>
        </div>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs">GDPR Compliant</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your data is protected and encrypted. We never share your information.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} ConferenceRoom Booker. All rights reserved.
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </button>
          <span className="text-muted-foreground">•</span>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </button>
          <span className="text-muted-foreground">•</span>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicators;