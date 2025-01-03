<template>
  <div class="aircraft-selected-info">
    <div v-if="true" class="aircraft-info">

      <div class="">
        <p class="aircraft-title">Aircraft Selected</p>
      </div>

      <div class="aircraft-image">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREaCaG-oGCrXvRNW7GG8hHD12ip2MD6U4DXQ&s" alt="">
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

      <div class="maps-info">
        <div class="maps-header">
          <p class="aircraft-title">Legs Map</p>
          <button type="button" class=" btn-map">Update Map
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
</svg>
          </button>
        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7495441.747597087!2d-107.91082726817935!3d23.464660442502755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84043a3b88685353%3A0xed64b4be6b099811!2zTcOpeGljbw!5e0!3m2!1ses-419!2smx!4v1735357383184!5m2!1ses-419!2smx" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
        <button type="button"class=" btn-quote">Save Quote</button>
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