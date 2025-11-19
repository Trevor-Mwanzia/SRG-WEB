# Script to update index.html with the requested changes

# Read the file
$content = Get-Content "index.html" -Raw

# 1. Update carousel - add 6 new slides after the 4th slide
$oldCarouselSlides = @'
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/clean4.jpg" alt="Neurodiverse children 4" class="w-full h-64 md:h-80 object-contain" />
    </div>
  </div>
'@

$newCarouselSlides = @'
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/clean4.jpg" alt="Neurodiverse children 4" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG11-20251110-WA0026.jpg" alt="Community Event 1" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG22-20251110-WA0027.jpg" alt="Community Event 2" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG33-20251110-WA0028.jpg" alt="Community Event 3" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG44-20251110-WA0029.jpg" alt="Community Event 4" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG55-20251110-WA0030.jpg" alt="Community Event 5" class="w-full h-64 md:h-80 object-contain" />
    </div>
    <div class="carousel-slide flex-shrink-0 w-full">
      <img src="images/UPDATE-UPDATE-IMG66-20251110-WA0031.jpg" alt="Community Event 6" class="w-full h-64 md:h-80 object-contain" />
    </div>
  </div>
'@

$content = $content -replace [regex]::Escape($oldCarouselSlides), $newCarouselSlides

# 2. Update carousel indicators - change from 4 to 10 indicators
$oldIndicators = @'
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors active" aria-label="Go to slide 1"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 2"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 3"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 4"></button>
'@

$newIndicators = @'
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors active" aria-label="Go to slide 1"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 2"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 3"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 4"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 5"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 6"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 7"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 8"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 9"></button>
    <button class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" aria-label="Go to slide 10"></button>
'@

$content = $content -replace [regex]::Escape($oldIndicators), $newIndicators

# 3. Update 2020-2021 journey text
$oldGrowth = '<p class="text-gray-600">Launch of donation drives and community outreach programs across Nairobi</p>'
$newGrowth = '<p class="text-gray-600">Launched donation drives and community outreach programs across Nairobi and Cape Town.</p>'
$content = $content -replace [regex]::Escape($oldGrowth), $newGrowth

# 4. Update 2022-2024 journey text
$oldPartnership = '<p class="text-gray-600">Collaboration with Advocate Mother Sandy and expansion to Morocco, Tunisia partnerships</p>'
$newPartnership = '<p class="text-gray-600">Collaborating with Advocate Mother Sandy and expanding to India, Oman, Morocco, Tunisia, Zambia, Botswana, Uganda, Tanzania, Zimbabwe, and many other countries around the world.</p>'
$content = $content -replace [regex]::Escape($oldPartnership), $newPartnership

# 5. Add Past Shows section after Calendar View
$calendarEnd = @'
        </div>
      </div>
     </div>
    </div>
   </section><!-- Stories & Spotlights Section -->
'@

$calendarWithPastShows = @'
        </div>
      </div>
      <div id="past-shows" class="bg-gray-50 rounded-2xl p-8 mt-12">
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Past Shows</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div class="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-md">
            <span class="text-purple-700 font-semibold">Show 1</span>
          </div>
          <div class="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-md">
            <span class="text-blue-700 font-semibold">Show 2</span>
          </div>
          <div class="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-md">
            <span class="text-green-700 font-semibold">Show 3</span>
          </div>
        </div>
      </div>
     </div>
    </div>
   </section><!-- Stories & Spotlights Section -->
'@

$content = $content -replace [regex]::Escape($calendarEnd), $calendarWithPastShows

# Write the updated content back
$content | Set-Content "index.html" -NoNewline

Write-Host "Successfully updated index.html"
