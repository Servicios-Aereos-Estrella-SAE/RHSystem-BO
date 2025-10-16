<template>
  <div class="vacation-signature-pad">
    <div class="signature-header">
      <h3>{{ $t('digital_signature') }}</h3>
      <p class="description">{{ $t('sign_to_authorize_vacation_requests') }}</p>
    </div>

    <div class="signature-container">
      <div class="signature-pad-wrapper">
        <SignaturePad
          ref="signaturePad"
          :options="signatureOptions"
          class="signature-pad"
          @begin="onBegin"
          @end="onEnd"
        />
        <div v-if="isDrawing" class="drawing-indicator active">
          <i class="pi pi-pencil"></i>
          <span>{{ $t('drawing_in_progress') }}</span>
        </div>
      </div>

      <div class="signature-actions">
        <Button
          :label="$t('clear')"
          icon="pi pi-eraser"
          class="p-button-outlined p-button-sm"
          @click="clearSignature"
          :disabled="!hasSignature"
        />
        <Button
          :label="$t('undo')"
          icon="pi pi-undo"
          class="p-button-outlined p-button-sm"
          @click="undoSignature"
          :disabled="!hasSignature"
        />

        <!-- Botón para forzar verificación -->
        <Button
          :label="$t('scan_signature')"
          icon="pi pi-verified"
          class="p-button-success p-button-sm"
          @click="checkSignatureStatus"
        />
      </div>
    </div>

    <div class="signature-status">
      <div v-if="hasSignature" class="status-success">
        <i class="pi pi-check-circle"></i>
        <span>{{ $t('signature_ready') }}</span>
      </div>
      <div v-else class="status-warning">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ $t('signature_required') }}</span>
      </div>
    </div>

    <!-- Debug info -->
    <div class="debug-info" v-if="false"> <!-- Cambia a true para debug -->
      <p><strong>Debug Info:</strong></p>
      <p>hasSignature: {{ hasSignature }}</p>
      <p>isDrawing: {{ isDrawing }}</p>
      <p>SignaturePad Ref: {{ $refs.signaturePad ? 'Found' : 'Not Found' }}</p>
    </div>

    <div class="signature-footer">
      <div class="signature-info">
        <p><i class="pi pi-info-circle"></i> {{ $t('signature_instructions') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>
