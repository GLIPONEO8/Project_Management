class ShopsManager {
    constructor() {
        this.currentLocation = null;
        this.shops = shopData.shops;
        this.currentCategory = 'all';
        this.initializeComponents();
    }

    async initializeComponents() {
        await this.getCurrentLocation();
        this.setupEventListeners();
        this.renderShops();
    }

    async getCurrentLocation() {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const locationElement = document.getElementById('current-location');
            const response = await fetch(
                'https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.currentLocation.lat},${this.currentLocation.lng}&key=YOUR_GOOGLE_MAPS_API_KEY'
            );
            const data = await response.json();
            const cityName = this.extraCityFromGeocodingResult(data);
            locationElement.textContent = cityName;
        } catch (error) {
            console.error('Error getting location:',error);
            document.getElementById('current-location').textContent = 'Location access denied';
        }
    }

    extraCityFromGeocodingResult(geocodingResult) {
        for (const component of geocodingResult.results[0].address_components) {
            if (component.tyoes.includes('locality')) {
                return component.long_name;
            }
        }
        return 'Unknown City';
    }

    setupEventListeners() {
        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategory = button.dataset.category;
                this.updateActiveCategory(button);
                this.renderShops();
            });
        });

        document.getElementById('refresh-location').addEventListener('click', () => {
            this.getCurrentLocation();
        });
    }

    updateActiveCategory(activeButton) {
        document.querySelectorAll('.category-btn').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    calculateDistance(shop) {
        if (!this.currentLocation) return Infinity;

        const R = 6371;
        const dLat = this.toRad(shop.coordinates.lat - this.currentLocation.lat);
        const dLon = this.toRad(shop.coordinates.lng - this.currentLocation.lng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(this.currentLocation.lat)) *
                  Math.cos(this.toRad(shop.coordinates.lat)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sort(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    renderShops() {
        const shopList = document.getElementById('shopList');
        shopList.innerHTML = '';

        let filteredShops = this.shops;
        if (this.currentCategory !== 'all') {
            filteredShops = this.shops.filter(shop => shop.category === this.currentCategory);
        }

        if (this.currentLocation) {
            filteredShops.sort((a, b) => {
                return this.calculateDistance(a) - this.calculateDistance(b);
            });
        }

        filteredShops.forEach(shop => {
            const shopCard = this.createShopCard(shop);
            shopList.appendChild(shopCard);
        });
    }

    createShopCard(shop) {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
            <h3>${shop.name}</h3>
            <p>${shop.address}</p>
            <p>Hours: ${shop.openingHours}</p>
            ${shop.hasOnlineStore ? ` <p><a href="${shop.onlineStoreUrl}" target="_blank">Visit Online Store</a></p>` : ''}
            `;

            card.addEventListener('click', () => {
                this.showShopDetails(shop);
            });

            return card;
    }

    showShopDetails(shop) {
        const modal = document.getElementById('shopModal');
        const detailsContainer = document.getElementById('shopDetails');

        detailsContainer.innerHTML = `
            <h2>${shop.name}</h2>
            <p>${shop.address}</p>
            <p>Hours: ${shop.openingHours}</p>
            <p>Category: ${shop.category}</p>
            ${shop.hasOnlineStore ? ` <p><a href=${shop.onlineStoreUrl}" target=_blank">Visit Online Store</a></p>` : ''}
            `
            const map = new google.maps.Map(document.getElementById('map'), {
                center: shop.coordinates,
                zoom: 15
            });

            new google.maps.Marker({
                position: shop.coordinates,
                map: map,
                title: shop.name
            });

            modal.style.display = 'block';

            const closeBtn = modal.querySelector('.close');
            closeBtn.onclick = () => modal.style.display = 'none';
            window.onclick = event => {
                if (event.target === modal) modal.style.display = 'none';
            };
    }
}

// Initialize the Shops Manager
document.addEventListener('DOMContentLoaded', () => {
    new ShopsManager();
});