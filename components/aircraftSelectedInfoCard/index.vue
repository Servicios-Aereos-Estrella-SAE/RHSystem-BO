<template>
  <div class="aircraft-selected-info">
    <div v-if="true" class="aircraft-info">

      <div class="">
        <p class="aircraft-title">Aircraft Selected</p>
      </div>

      <div class="aircraft-image">
        <img src="https://www.guardianjet.com/userfiles/files/specs/Lear75/ext4c_300.jpg" alt="">
      </div>

      <div class="details">
        <div class="aircraft-details-info">
          <p>Aircraft</p>
          <p>Learjet 75</p>
        </div>
        <div class="aircraft-details-info">
          <p>Aircraft Class</p>
          <p>Compact Light Jet</p>
        </div>
        <div class="aircraft-details-info">
          <p>PAX Limit</p>
          <p>7 PAX</p>
        </div>
        <div class="aircraft-details-info">
          <p>Autonomy</p>
          <p>1,200 mn</p>
        </div>
        <div class="aircraft-details-info">
          <p>Autonomy Hours</p>
          <p>4 Hrs</p>
        </div>
        <div class="aircraft-details-info">
          <p>Max Bggage</p>
          <p>140 kg</p>
        </div>
        <div class="aircraft-details-info">
          <p>Hourly Rate</p>
          <p>$3, 100.00</p>
        </div>
      </div>



      <div class="detail-itinerary">
        <div class="itinerary-info">
          <p class="title-itinerary">Itinerary Leg 01</p>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/despegue.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX)</p>
            </div>
            
          </div>
          <br>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/aterrizaje.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX) | Fuel Stop</p>
            </div>
            
          </div>
        </div>
        <div class="itinerary-info">
          <p class="title-itinerary">Itinerary Leg 01</p>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/despegue.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX)</p>
            </div>
            
          </div>
          <br>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/aterrizaje.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX) | Fuel Stop</p>
            </div>
            
          </div>
        </div>
        <div class="itinerary-info">
          <p class="title-itinerary">Itinerary Leg 01</p>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/despegue.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX)</p>
            </div>
            
          </div>
          <br>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/aterrizaje.png" alt="">
            </div>
            <div>
              <p>Aeropuerto Internacional Francisco Sarabia</p>
            <p>Torreón Coahuila, México.</p>
            <p>04/03/24 - 10:11 (03 PAX) | Fuel Stop</p>
            </div>
            
          </div>
        </div>
      </div>

      <div class="line-dash">
        <hr>
      </div>

      <div class="info-cost">
        <div class="info-cost-details">
          <div class="info-cost-item">
            <p>Quote Cost</p>
            <p>$ 8,700.00 USD</p>
          </div>
          <div class="info-cost-item">
            <p>Quote Margin</p>
            <p>$ 0.00 USD</p>
          </div>
          <div class="info-cost-item">
            <p class="color-text">Quote Total</p>
            <p class="color-text">$ 8,700.00 USD</p>
          </div>
          <div class="info-cost-item">
            <p class="color-text">Quote Total</p>
            <p class="color-text">$ 146, 943.00 USD</p>
          </div>
          <div class="info-cost-item">
            <p>Exchange Rate</p>
            <p>$ 16.89 USD</p>
          </div>
  
        </div>
      </div>

      <div class="bnt-save">
        <button type="button" class=" btn-quote">Save Quote</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>