import axios from 'axios'

const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010"
const baseUrl = "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST"

// content property uses a function to res
export const state = {
    title: "{NAME}",
    content: function (feature) {
        const state = feature.graphic.attributes.STATE
        // returns a table from promise call
        const dataPromise = axios.get(`${baseUrl}&for=state:${state}&key=${key}`).then(res => {
            const data = res.data

            return `
        <table>
          <tr>
            <th>Language</th>
            <th>Estimate</th>
          </tr>
          ${data.map((censusInfo, i) => (
                `${i !== 0 ? `<tr> <td className="label">${censusInfo[0]}</td>
          <td>${censusInfo[2]}</td>
          </tr>` : ""}`
            ))}
        </table>`
        })
        // returns promise table to content scope
        return dataPromise
    },
}

export const county = {
    title: "{NAME}",
    // content property takes a function with a feature property as a parameter
    content: function (feature) {
        const state = feature.graphic.attributes.STATE
        const county = feature.graphic.attributes.COUNTY
        const dataPromise = axios.get(`${baseUrl}&for=county:${county}&in=state:${state}&key=${key}`).then(res => {
            const data = res.data
            // error handling incase no data is returned
            if (data) {
                // table if data is returned
                return `
        <table>
          <tr>
            <th>Language</th>
            <th>Estimate</th>
          </tr>
          ${data.map((censusInfo, i) => (
                    `${i !== 0 ? `<tr> <td class="label">${censusInfo[0]}</td>
          <td>${censusInfo[2]}</td>
          </tr>` : ""}`
                ))}
        </table>`
            } else { // incase no data is returned
                return "No census data to show for {NAME}"
            }
        })

        // returning promise value
        return dataPromise
    }
}