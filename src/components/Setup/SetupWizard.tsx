import { SetupProvider, useSetup } from './SetupContext';
import { WelcomeStep } from './steps/WelcomeStep';
import { SupabaseStep } from './steps/SupabaseStep';
import { R2Step } from './steps/R2Step';
import { BrandingStep } from './steps/BrandingStep';
import { AdminStep } from './steps/AdminStep';
import { CompleteStep } from './steps/CompleteStep';

const STEPS = [
  { id: 'welcome', label: 'Welcome', component: WelcomeStep },
  { id: 'supabase', label: 'Database', component: SupabaseStep },
  { id: 'r2', label: 'Media Storage', component: R2Step },
  { id: 'branding', label: 'Branding', component: BrandingStep },
  { id: 'admin', label: 'Admin Account', component: AdminStep },
  { id: 'complete', label: 'Complete', component: CompleteStep },
];

function SetupProgress() {
  const { state } = useSetup();
  const { currentStep } = state;

  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-medium transition-colors ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index < currentStep ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-12 h-1 mx-2 transition-colors ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepLabels() {
  const { state } = useSetup();
  const { currentStep } = state;

  return (
    <div className="text-center mb-6">
      <p className="text-tiny text-text-muted uppercase tracking-wide">
        Step {currentStep + 1} of {STEPS.length}
      </p>
      <h2 className="text-xl font-bold text-text-primary mt-1">{STEPS[currentStep].label}</h2>
    </div>
  );
}

function SetupContent() {
  const { state } = useSetup();
  const { currentStep } = state;
  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SetupProgress />
          <StepLabels />
          <CurrentStepComponent />
        </div>
      </div>
    </div>
  );
}

export function SetupWizard() {
  return (
    <SetupProvider>
      <SetupContent />
    </SetupProvider>
  );
}
