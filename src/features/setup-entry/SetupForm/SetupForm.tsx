"use client";

import { Field, FieldHint } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  Checkbox,
  CheckboxLabel,
  CheckboxList,
  ErrorText,
  FieldGrid,
  FormCard,
  FormActions,
  SaveButton,
  Section,
  SectionDescription,
  SectionTitle,
  Select,
} from "./SetupForm.styles";
import type { ConfirmationKey, SetupFormProps } from "./SetupForm.types";

const confirmationFields: Array<{ key: ConfirmationKey; label: string }> = [
  { key: "brokeOpeningRange", label: "Broke opening range" },
  { key: "heldRetest", label: "Held retest" },
  { key: "volumeConfirmed", label: "Volume confirmed" },
  { key: "trendAligned", label: "Trend aligned" },
  { key: "avoidedChop", label: "Avoided chop" },
];

export function SetupForm({
  draft,
  onDraftChange,
  onSaveSetup,
  saveErrorMessage,
}: SetupFormProps) {
  return (
    <FormCard aria-labelledby="setup-form-title">
      <Section>
        <SectionTitle id="setup-form-title">Opening range</SectionTitle>
        <SectionDescription>
          Define the session range first. The entry must break this range in the
          planned direction.
        </SectionDescription>
        <FieldGrid>
          <Field>
            Symbol
            <Input
              value={draft.symbol}
              placeholder="SPY"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  symbol: event.target.value,
                }))
              }
            />
          </Field>
          <Field>
            Market date
            <Input
              type="date"
              value={draft.marketDate}
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  marketDate: event.target.value,
                }))
              }
            />
          </Field>
          <Field>
            Opening range high
            <FieldHint>Highest price during the opening range.</FieldHint>
            <Input
              inputMode="decimal"
              value={draft.openingRangeHigh}
              placeholder="100.00"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  openingRangeHigh: event.target.value,
                }))
              }
            />
          </Field>
          <Field>
            Opening range low
            <FieldHint>Lowest price during the opening range.</FieldHint>
            <Input
              inputMode="decimal"
              value={draft.openingRangeLow}
              placeholder="95.00"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  openingRangeLow: event.target.value,
                }))
              }
            />
          </Field>
        </FieldGrid>
      </Section>

      <Section>
        <SectionTitle>Planned trade</SectionTitle>
        <SectionDescription>
          Enter the planned entry, invalidation, and target before saving the
          setup.
        </SectionDescription>
        <FieldGrid>
          <Field>
            Direction
            <Select
              value={draft.direction}
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  direction: event.target.value === "short" ? "short" : "long",
                }))
              }
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </Select>
          </Field>
          <Field>
            Entry price
            <Input
              inputMode="decimal"
              value={draft.entryPrice}
              placeholder="101.00"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  entryPrice: event.target.value,
                }))
              }
            />
          </Field>
          <Field>
            Stop price
            <FieldHint>Price where the setup is invalidated.</FieldHint>
            <Input
              inputMode="decimal"
              value={draft.stopPrice}
              placeholder="98.00"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  stopPrice: event.target.value,
                }))
              }
            />
          </Field>
          <Field>
            Target price
            <Input
              inputMode="decimal"
              value={draft.targetPrice}
              placeholder="108.00"
              onChange={(event) =>
                onDraftChange((current) => ({
                  ...current,
                  targetPrice: event.target.value,
                }))
              }
            />
          </Field>
        </FieldGrid>
      </Section>
      <Section>
        <SectionTitle>Checklist confirmations</SectionTitle>
        <SectionDescription>
          Missing confirmations fail the setup. Leave a box unchecked when the
          condition is not present.
        </SectionDescription>
        <CheckboxList>
          {confirmationFields.map((field) => (
            <CheckboxLabel key={field.key}>
              <Checkbox
                type="checkbox"
                checked={draft.confirmations[field.key]}
                onChange={(event) =>
                  onDraftChange((current) => ({
                    ...current,
                    confirmations: {
                      ...current.confirmations,
                      [field.key]: event.target.checked,
                    },
                  }))
                }
              />
              {field.label}
            </CheckboxLabel>
          ))}
        </CheckboxList>
      </Section>
      <FormActions>
        <SaveButton type="button" onClick={onSaveSetup}>
          Save evaluated setup
        </SaveButton>
        {saveErrorMessage !== null ? (
          <ErrorText role="alert">{saveErrorMessage}</ErrorText>
        ) : null}
      </FormActions>
    </FormCard>
  );
}
