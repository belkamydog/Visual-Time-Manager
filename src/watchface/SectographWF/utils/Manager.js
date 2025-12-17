
export class Manager{

    static getNextState(listOfEvents) {
        const now = new Date().getTime();
        let result = null;
        
        listOfEvents.forEach(element => {
            const start = new Date(element.start).getTime();
            const end = new Date(element.end).getTime();
            
            // Проверяем, находится ли текущее время внутри интервала события
            if (now >= start && now <= end) {
                result = { ...element };
                return result;
            }
            // Если текущее время меньше начала события, проверяем ближайшие
            else if (now < start) {
                if (!result || start < new Date(result.start).getTime()) {
                    result = { ...element };
                }
            }
        });

        // Если события не найдены, возвращаем дефолтное значение
        return result || { 
            description: 'Open app to create new events', 
            state: '' 
        };
    }


    static uploadActualEvents(){

    }
}