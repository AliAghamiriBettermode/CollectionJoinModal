# Collection Join Modal

This project handles showing a modal after a user logged in to join a collection.

## Flow Overview

1. **Create an App and Install It**
    - Obtain `client_id`, `client_secret`, and `webhook_signing_secret`.

2. **Add Custom Code**
    - Add custom code to `<body>` section
    - Script can be found under `consts/body-custom-code.html` file.
    ```html
    <script>
    async function handleSelectiveJoin() {
        function hideModal() {
            const modal = document.getElementById('collection-join-modal')
            modal.style.display = 'none'
        }

        function showModal() {
            const modal = document.getElementById('collection-join-modal')
            modal.style.display = 'flex'
        }

        if (localStorage.getItem('collection-join-modal') !== 'true' && !(__BM_DATA__.authToken.member.id.toLowerCase().includes('guest'))) {
            const response = await fetch('https://example.com/admin/modal-data', {
                method: 'POST',
                body: new URLSearchParams(),
                redirect: 'follow',
            })
            const result = await response.json()
            const modalHTML = result.data.html
   
            document.body.insertAdjacentHTML('beforeend', modalHTML)
            
            showModal()
            try {
                const memberId = __BM_DATA__.authToken.member.id
                const myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
                const urlencoded = new URLSearchParams()
                urlencoded.append('member_id', memberId)
                fetch('https://piranha-ruling-scarcely.ngrok-free.app/admin/join-collection', {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow',
                })
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) {
                        localStorage.setItem('collection-join-modal', 'true')
                        location.reload()
                    }
                    hideModal()
                })
                .catch((error) => {
                    hideModal()
                })
            } catch (e) {
                console.error(e)
                hideModal()
            }
        }
    }
   
    window.addEventListener('DOMContentLoaded', handleSelectiveJoin)
    
    </script>
    ```

3. **Create a `.env` File**
    - Fill the `.env` file with the following variables:
    ```sh
   # Backend
   NODE_APP_PORT=XXXX
   
   # Bettermode
   WEBHOOK_SIGNING_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   CLIENT_ID=XXXXXXXX-XXXXXXXXXXXXXXXX
   CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ADMIN_MEMBER_ID=XXXXXXXX
   NETWORK_ID=XXXXXXXX
    ```

4. **Retrieve Collection Data**
    - Get collections of your community with the following mutation:
    ```graphql
    query Collections {
        collections {
            id
            name
            spaces(limit: 10) {
                nodes {
                    id
                    name
                }
            }
        }
    }
   ```
    - Save data in the `consts/collections.ts` file with specific format.
    - Add CountryGroup to each collection in the `consts/collections.ts` file.

5. **Country List**
    - You can find the country list in the `consts/countries.ts` file.
    - Update the country list in the `consts/countries.ts` file if needed.

6. **Run the Project**
    - Run the project using the following command:
    ```sh
    npm start
    ```