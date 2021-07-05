import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { WizardDirective } from "./wizard.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";
import { WizardStepHeaderComponent } from "./wizard-step-header/wizard-step-header.component";
import { WizardFooterComponent } from "./wizard-footer/wizard-footer.component";
import { WizardStepLabelDirective } from "./wizard-step-label.directive";
import { WizardStepFooterDirective } from "./wizard-step-footer.directive";
import { WizardStepperNextDirective, WizardStepperPreviousDirective } from "./wizard-button/wizard-button";
import { CdkStepper, STEP_STATE } from "@angular/cdk/stepper";

@Component({
    selector: "nui-test-cmp",
    template: `
        <div>
            <nui-wizard-step-v2 label="step1"></nui-wizard-step-v2>
            <nui-wizard-step-v2 label="step2"></nui-wizard-step-v2>
            <nui-wizard-step-v2 label="step3"></nui-wizard-step-v2>
        </div>`,
})
class TestWrapperComponent extends WizardDirective {}

describe("directives >", () => {
    describe("WizardDirective", () => {
        let component: TestWrapperComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    WizardStepHeaderComponent,
                    WizardFooterComponent,
                    WizardStepV2Component,
                    WizardDirective,
                    WizardStepLabelDirective,
                    WizardStepFooterDirective,
                    WizardStepperNextDirective,
                    WizardStepperPreviousDirective,
                    TestWrapperComponent,
                ],
                providers: [
                    CdkStepper,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        describe("ngAfterViewInit", () => {
            it("should call restore if state finished", () => {
                const spy = spyOn(component, "restore" as never);

                component.state = { finished: true };
                component.ngAfterViewInit();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("ngOnChanges", () => {
            it("should set state", () => {
                const changes = {
                    state: {
                        currentValue: { finished: false },
                    },
                };

                component.ngOnChanges(changes as any);
                expect(component.state).toEqual(changes.state.currentValue);
            });
        });

        describe("getStepState", () => {
            it("should return error state if step invalid", () => {
                const stepMock: WizardStepV2Component = { hasError: true } as WizardStepV2Component;

                spyOn(component.steps, "toArray").and.returnValue([stepMock]);
                spyOnProperty(component, "selected").and.returnValue(stepMock);

                const state = component.getStepState(0);

                expect(state).toEqual(STEP_STATE.ERROR);
            });

            it("should return edit state for current no completed step", () => {
                const stepMock: WizardStepV2Component = {} as WizardStepV2Component;

                spyOn(component.steps, "toArray").and.returnValue([stepMock]);

                const state = component.getStepState(0);

                expect(state).toEqual(STEP_STATE.EDIT);
            });

            it("should return complete state for completed step", () => {
                const stepMock: WizardStepV2Component = { completed: true } as WizardStepV2Component;
                const otherStep: WizardStepV2Component = {} as WizardStepV2Component;

                spyOn(component.steps, "toArray").and.returnValue([stepMock, otherStep]);
                spyOnProperty(component, "selected").and.returnValue(otherStep);

                const state = component.getStepState(0);

                expect(state).toEqual(STEP_STATE.DONE);
            });

            it("should return number state", () => {
                const stepMock: WizardStepV2Component = {} as WizardStepV2Component;
                const otherStep: WizardStepV2Component = {} as WizardStepV2Component;

                spyOn(component.steps, "toArray").and.returnValue([stepMock, otherStep]);
                spyOnProperty(component, "selected").and.returnValue(stepMock);

                const state = component.getStepState(1);

                expect(state).toEqual(STEP_STATE.NUMBER);
            });
        });
    });
});