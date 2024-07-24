document.addEventListener('DOMContentLoaded', () => {
    const partyForm = document.getElementById('party-form');
    const partyList = document.getElementById('party-list');
    const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/parties';

    // Function to fetch parties from the API
    const fetchParties = async () => {
        try {
            const response = await fetch(apiUrl);
            const parties = await response.json();
            console.log('Fetched parties:', parties);
            renderParties(parties);
        } catch (error) {
            console.error('Error fetching parties:', error);
        }
    };

    // Function to render parties to the DOM
    const renderParties = (parties) => {
        if (!Array.isArray(parties)) {
            console.error('Expected an array of parties, but got:', parties);
            return;
        }
        
        partyList.innerHTML = '';
        parties.forEach(party => {
            const partyDiv = document.createElement('div');
            partyDiv.classList.add('party');
            partyDiv.innerHTML = `
                <h3>${party.name}</h3>
                <p>Date: ${party.date}</p>
                <p>Time: ${party.time}</p>
                <p>Location: ${party.location}</p>
                <p>Description: ${party.description}</p>
                <button class="delete-btn" data-id="${party.id}">Delete</button>
            `;
            partyList.appendChild(partyDiv);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const partyId = e.target.getAttribute('data-id');
                await deleteParty(partyId);
            });
        });
    };

    // Function to add a new party
    partyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newParty = {
            name: document.getElementById('name').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
        };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newParty),
            });
            const addedParty = await response.json();
            console.log('Added party:', addedParty);
            fetchParties();
        } catch (error) {
            console.error('Error adding party:', error);
        }
    });

    // Function to delete a party
    const deleteParty = async (id) => {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });
            fetchParties();
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    };

    // Fetch and render parties on page load
    fetchParties();
});
