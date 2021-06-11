import { InjectionToken } from "@angular/core";
import { IWizardConfig, WizardStepStateConfig } from "../lib/public-api";

export const WIZARD_CONFIG = new InjectionToken<IWizardConfig>("wizard.conf");

export const WIZARD_STEP_STATE_DEFAULT_CONFIG: WizardStepStateConfig = {
    initial: {
        icon: "step",
        iconColor: "gray",
    },
    visited: {
        icon: "step-complete",
        iconColor: "primary-blue",
    },
    active: {
        icon: "step-active",
        iconColor: "black",
    },
    error: {
        icon: "severity_error",
        iconColor: "red",
    },
}

export const WIZARD_CONFIG_DEFAULT: IWizardConfig = {
    stepState: {...WIZARD_STEP_STATE_DEFAULT_CONFIG},
}